
import { PolicyLayout } from "@/components/layout/policy-layout"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
    const faqs = [
        {
            question: "How do I track my order?",
            answer: "Once your order ships, you will receive an email with a tracking number. You can also view your order status in your account dashboard under 'My Orders'."
        },
        {
            question: "What is your return policy?",
            answer: "We accept returns within 30 days of purchase. Items must be unworn, unwashed, and with original tags attached. Some items like innerwear are non-returnable."
        },
        {
            question: "Do you ship internationally?",
            answer: "Currently, we only ship within India. We plan to expand globally soon."
        },
        {
            question: "How can I pay for my order?",
            answer: "We support Credit/Debit cards, Net Banking, UPI, and Cash on Delivery (COD) for eligible pincodes."
        },
        {
            question: "I forgot my password, how do I reset it?",
            answer: "Click on 'Forgot Password' on the login screen. We will send a reset link to your registered email address."
        }
    ]

    return (
        <PolicyLayout title="Frequently Asked Questions">
            <p className="mb-6 text-gray-600">Find answers to the most common questions about shopping on VogueX.</p>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border-b border-gray-200">
                        <AccordionTrigger className="text-gray-800 hover:text-blue-600 text-left font-medium">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </PolicyLayout>
    )
}
