from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib.enums import TA_RIGHT, TA_CENTER, TA_LEFT
import io
from datetime import datetime

def generate_invoice_pdf(order):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, 
        pagesize=A4,
        rightMargin=1.5*cm, leftMargin=1.5*cm, 
        topMargin=1.5*cm, bottomMargin=1.5*cm
    )
    elements = []
    styles = getSampleStyleSheet()

    # --- Custom Styles ---
    # Leading increased to 28 to prevent overlap
    styles.add(ParagraphStyle(name='BrandTitle', fontSize=24, fontName='Helvetica-Bold', textColor=colors.HexColor('#111827'), spaceAfter=10, leading=28))
    styles.add(ParagraphStyle(name='TaxLabel', fontSize=10, fontName='Helvetica', textColor=colors.gray, spaceAfter=20))
    styles.add(ParagraphStyle(name='CenterTitle', fontSize=12, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=20))
    styles.add(ParagraphStyle(name='SectionHeader', fontSize=10, fontName='Helvetica-Bold', textColor=colors.HexColor('#374151'), spaceAfter=5))
    styles.add(ParagraphStyle(name='NormalSmall', fontSize=9, fontName='Helvetica', textColor=colors.HexColor('#4B5563'), leading=12))
    styles.add(ParagraphStyle(name='NormalBold', fontSize=9, fontName='Helvetica-Bold', textColor=colors.black, leading=12))
    styles.add(ParagraphStyle(name='RightAlign', fontSize=9, fontName='Helvetica', alignment=TA_RIGHT))
    styles.add(ParagraphStyle(name='RightAlignBold', fontSize=10, fontName='Helvetica-Bold', alignment=TA_RIGHT))
    styles.add(ParagraphStyle(name='Page2Title', fontSize=16, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=20))
    styles.add(ParagraphStyle(name='CutLabel', alignment=TA_CENTER, fontName='Helvetica-Bold', fontSize=10))

    # --- 1. Header Section ---
    # Centered Title
    elements.append(Paragraph("TAX INVOICE", styles['CenterTitle']))
    elements.append(Spacer(1, 0.2*cm))

    # Left: Brand & Address
    company_details = """
    <b>VOGUEX RETAIL PVT LTD</b><br/>
    VogueX Towers, Fashion Street<br/>
    Bangalore, KA, 560001<br/>
    GSTIN: 29VOGUEX1234Z1<br/>
    support@voguex.com | www.voguex.com
    """
    
    # Right: Invoice Details
    invoice_date = order.created_at.strftime('%d-%b-%Y')
    invoice_details = f"""
    <b>INVOICE NO:</b> INV-{order.order_id}<br/>
    <b>DATE:</b> {invoice_date}<br/>
    <b>ORDER ID:</b> #{order.order_id}<br/>
    <b>PAYMENT:</b> {order.razorpay_payment_id or 'Prepaid/COD'}
    """
    
    header_data = [
        [
            [Paragraph("VOGUEX", styles['BrandTitle']), Paragraph(company_details, styles['NormalSmall'])],
            Paragraph(invoice_details, ParagraphStyle(name='InvoiceDetails', parent=styles['NormalSmall'], alignment=TA_RIGHT, leading=14))
        ]
    ]
    
    header_table = Table(header_data, colWidths=[11*cm, 7*cm])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 0.5*cm))
    
    # --- Divider ---
    elements.append(Paragraph("_" * 95, ParagraphStyle(name='Divider', fontSize=6, textColor=colors.lightgrey, alignment=TA_CENTER)))
    elements.append(Spacer(1, 0.5*cm))

    # --- 2. Billing & Shipping ---
    # Parsing Address (Naive split or just full text)
    raw_address = getattr(order, 'shipping_address', 'N/A') or 'N/A'
    customer_addr = raw_address.replace('\n', '<br/>')
    user_phone = getattr(order.user, 'phone_number', '') or "N/A"
    user_email = order.user.email
    
    bill_to = f"""
    <b>BILL TO</b><br/>
    <b>{order.user.first_name} {order.user.last_name}</b><br/>
    {customer_addr}<br/>
    Phone: {user_phone}<br/>
    Email: {user_email}
    """
    
    # Assuming Ship To is same
    ship_to = f"""
    <b>SHIP TO</b><br/>
    <b>{order.user.first_name} {order.user.last_name}</b><br/>
    {customer_addr}<br/>
    """
    
    addr_data = [[Paragraph(bill_to, styles['NormalSmall']), Paragraph(ship_to, styles['NormalSmall'])]]
    addr_table = Table(addr_data, colWidths=[9*cm, 9*cm])
    addr_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
    ]))
    elements.append(addr_table)
    elements.append(Spacer(1, 1*cm))

    # --- 3. Items Table ---
    # Columns: #, Description, HSN, Qty, Rate, Tax, Amount
    table_header = ['#', 'Item Description', 'Qty', 'Rate', 'Tax (18%)', 'Amount']
    table_data = [table_header]
    
    total_tax = 0
    subtotal = 0
    items = order.items.all()
    
    for idx, item in enumerate(items, 1):
        price = float(item.price)
        amount = price * item.quantity
        
        # Back-calculate Tax
        taxable_value = amount / 1.18
        tax_amt = amount - taxable_value
        
        subtotal += taxable_value
        total_tax += tax_amt
        
        row = [
            str(idx),
            Paragraph(item.product_name, styles['NormalSmall']),
            str(item.quantity),
            f"{price/1.18:,.2f}", # Base Rate
            f"{tax_amt:,.2f}",
            f"{amount:,.2f}"
        ]
        table_data.append(row)

    # --- Table Layout ---
    col_widths = [1*cm, 8*cm, 1.5*cm, 2.5*cm, 2.5*cm, 2.5*cm]
    item_table = Table(table_data, colWidths=col_widths)
    
    # Styling
    t_style = [
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F3F4F6')), # Header BG
        ('TEXTCOLOR', (0,0), (-1,0), colors.black),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('BOTTOMPADDING', (0,0), (-1,0), 10),
        ('TOPPADDING', (0,0), (-1,0), 10),
        
        ('ALIGN', (2,0), (-1,-1), 'RIGHT'), # Numbers Right Align (Qty to Amount)
        ('ALIGN', (0,0), (1,-1), 'LEFT'),   # # and Desc Left Align
        
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 9),
        ('BOTTOMPADDING', (0,1), (-1,-1), 8),
        ('TOPPADDING', (0,1), (-1,-1), 8),
        
        ('LINEBELOW', (0,0), (-1,0), 1, colors.HexColor('#E5E7EB')),
        ('LINEBELOW', (0,1), (-1,-1), 0.5, colors.HexColor('#F3F4F6')),
    ]
    item_table.setStyle(TableStyle(t_style))
    elements.append(item_table)
    
    # --- 4. Summary Section ---
    grand_total = float(order.total_amount)
    
    summary_data = [
        ['', 'Subtotal (Taxable):', f"{subtotal:,.2f}"],
        ['', 'CGST (9%):', f"{total_tax/2:,.2f}"],
        ['', 'SGST (9%):', f"{total_tax/2:,.2f}"],
        ['', 'Shipping:', '0.00']
    ]

    if getattr(order, 'gift_card_discount', 0) > 0:
        discount = float(order.gift_card_discount)
        summary_data.append(['', 'Gift Card Discount:', f"- ₹{discount:,.2f}"])
        # Adjust grand total display if needed, but Order.total_amount usually implies final payable?
        # Typically Invoice shows: Subtotal + Tax - Discount = Grand Total
        # Let's assume order.total_amount is the FINAL amount paid via Gateway.
        # Use computed logic or trust model? 
        # If model `total_amount` is what user paid, then logic:
        # (Subtotal + Tax) - Discount = Total Amount
        # Let's verify math: item amount includes tax? Yes in loop.
        # so Subtotal + Tax is essentially sum of amounts.
    
    summary_data.append(['', 'Grand Total:', f"₹{grand_total:,.2f}"])
    
    summary_table = Table(summary_data, colWidths=[11*cm, 4*cm, 3*cm])
    summary_table.setStyle(TableStyle([
        ('ALIGN', (1,0), (-1,-1), 'RIGHT'),
        ('FONTNAME', (1,-1), (-1,-1), 'Helvetica-Bold'), # Grand Total
        ('FONTSIZE', (1,-1), (-1,-1), 11),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LINEABOVE', (1,-1), (-1,-1), 1, colors.black), # Line above Total
    ]))
    
    elements.append(Spacer(1, 0.2*cm))
    elements.append(summary_table)
    
    elements.append(Spacer(1, 1*cm))

    # --- 5. Footer / Authorized Signatory ---
    footer_data = [
        [
            Paragraph("<b>Terms & Conditions:</b><br/>1. Goods once sold will not be taken back.<br/>2. Subject to Bangalore jurisdiction.<br/>3. This is a computer generated invoice.", styles['NormalSmall']),
            Paragraph("<b>For VogueX Retail Pvt Ltd</b><br/><br/><br/>Authorized Signatory", ParagraphStyle(name='AuthSign', parent=styles['NormalSmall'], alignment=TA_RIGHT))
        ]
    ]
    footer_table = Table(footer_data, colWidths=[10*cm, 8*cm])
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    elements.append(footer_table)

    # --- PAGE 2: Warranty & Returns Slip ---
    elements.append(PageBreak())
    
    elements.append(Paragraph("RETURN & WARRANTY SLIP", styles['Page2Title']))
    
    warranty_text = """
    <b>Returns Policy:</b><br/>
    You can return this item within 30 days of delivery. Please keep the item in its original condition, 
    with brand outer box, MRP tags attached, user manual, warranty cards, and original accessories in manufacturer packaging for a successful return pick-up.
    <br/><br/>
    <b>Warranty Information:</b><br/>
    This product is covered under a 1-year manufacturer warranty against manufacturing defects. 
    Physical damage is not covered. Please retain this invoice for warranty claims.
    <br/><br/>
    <b>Instructions:</b><br/>
    1. Cut this slip and paste it on the return package.<br/>
    2. Ensure the package is sealed securely.<br/>
    3. Hand over the package to our logistic partner.
    """
    elements.append(Paragraph(warranty_text, styles['NormalSmall']))
    elements.append(Spacer(1, 1*cm))
    
    # Dotted line box for "Cut Here"
    cut_here_data = [[Paragraph("PASTE THIS ON RETURN PACKAGE", styles['CutLabel'])]]
    cut_table = Table(cut_here_data, colWidths=[15*cm])
    cut_table.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.black),
        ('TOPPADDING', (0,0), (-1,-1), 20),
        ('BOTTOMPADDING', (0,0), (-1,-1), 20),
        # Using a solid line for now as reportlab standard dashed requires LinePlot or Drawing usually, keeping it simple box
    ]))
    
    elements.append(cut_table)
    
    # Build
    doc.build(elements)
    buffer.seek(0)
    return buffer
