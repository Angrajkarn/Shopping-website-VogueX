"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ArrowRight, Briefcase, CheckCircle2, MapPin, Upload } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area" // Assuming ScrollArea exists or use div overflow
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

const JOBS = [
    {
        id: "job_1",
        title: "Senior Fashion Designer",
        department: "Design",
        location: "New York, NY",
        type: "Full-time",
        tags: ["Creative", "Leadership"],
        description: "We are looking for a visionary Senior Fashion Designer to lead our upcoming collection. You will define the aesthetic direction, oversee the design process from concept to final sample, and collaborate with our sustainability team to ensure eco-friendly practices.",
        responsibilities: [
            "Lead the design process for seasonal collections.",
            "Create detailed technical packs and sketches.",
            "Mentor junior designers and interns.",
            "Collaborate with fabric sourcing teams for sustainable materials."
        ],
        requirements: [
            "7+ years of experience in high-end fashion design.",
            "Strong portfolio showcasing creative vision.",
            "Proficiency in Adobe Creative Suite and CLO3D.",
            "Deep understanding of garment construction and textiles."
        ],
        benefits: [
            "Competitive salary & equity.",
            "Full health, dental, and vision insurance.",
            "Generous clothing allowance.",
            "Annual fashion week travel."
        ]
    },
    {
        id: "job_2",
        title: "Frontend Engineer (React/Next.js)",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        tags: ["Tech", "Web3"],
        description: "Join our Engineering team to build the future of e-commerce. You will work on our high-performance storefront, 3D product viewers, and real-time features using Next.js and WebGL.",
        responsibilities: [
            "Develop pixel-perfect, responsive UI components.",
            "Optimize application performance for maximum speed.",
            "Integrate with backend APIs for real-time inventory and orders.",
            "Collaborate with designers to implement complex animations."
        ],
        requirements: [
            "5+ years of experience with React and TypeScript.",
            "Deep knowledge of Next.js and Server Side Rendering.",
            "Experience with Three.js or WebGL is a plus.",
            "Strong problem-solving skills and attention to detail."
        ],
        benefits: [
            "Remote-first culture.",
            "Latest MacBook Pro and home office stipend.",
            "Learning budget for conferences and courses.",
            "Flexible working hours."
        ]
    },
    // ... Add more jobs as needed (keeping it brief for this file edit)
]

export default function CareersPage() {
    const { toast } = useToast()
    const [selectedJob, setSelectedJob] = useState<typeof JOBS[0] | null>(null)
    const [isApplying, setIsApplying] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resumeName, setResumeName] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResumeName(e.target.files[0].name)
        }
    }

    const handleApplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const form = new FormData(e.currentTarget)
        if (selectedJob) {
            form.append("position", selectedJob.title)
        }

        try {
            await api.applyForJob(form)
            toast({
                title: "Application Submitted!",
                description: "We have received your application. Good luck!",
            })
            setIsApplying(false)
            setSelectedJob(null)
            setResumeName(null)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit application. Please try again.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Join the <span className="text-primary">Revolution</span>
                    </motion.h1>
                    <p className="text-xl text-muted-foreground">
                        We're building the future of fashion technology. If you're passionate, innovative, and ready to make an impact, we want you on our team.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                    {JOBS.map((job, idx) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-card border rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-lg transition-all group"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                                    {idx === 1 && <Badge className="bg-amber-500 hover:bg-amber-600">Hot</Badge>}
                                </div>
                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {job.department}</span>
                                    <span>•</span>
                                    <span>{job.location}</span>
                                    <span>•</span>
                                    <span>{job.type}</span>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    {job.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                                    ))}
                                </div>
                            </div>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="lg" className="shrink-0 w-full md:w-auto" onClick={() => setSelectedJob(job)}>
                                        Details & Apply <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
                                    {!isApplying ? (
                                        <>
                                            <DialogHeader className="p-6 pb-2">
                                                <DialogTitle className="text-2xl">{job.title}</DialogTitle>
                                                <DialogDescription className="text-base flex items-center gap-2 mt-2">
                                                    <Briefcase className="h-4 w-4" /> {job.department}
                                                    <span className="mx-2">•</span>
                                                    <MapPin className="h-4 w-4" /> {job.location}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                                <div className="space-y-6">
                                                    <section>
                                                        <h4 className="text-lg font-semibold mb-2">About The Role</h4>
                                                        <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                                                    </section>

                                                    <section>
                                                        <h4 className="text-lg font-semibold mb-3">Key Responsibilities</h4>
                                                        <ul className="space-y-2">
                                                            {job.responsibilities.map((r, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                                                    <ArrowRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                                                                    <span>{r}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </section>

                                                    <section>
                                                        <h4 className="text-lg font-semibold mb-3">Requirements</h4>
                                                        <ul className="space-y-2">
                                                            {job.requirements.map((r, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                                                    <CheckCircle2 className="h-4 w-4 mt-1 text-primary shrink-0" />
                                                                    <span>{r}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </section>

                                                    <section>
                                                        <h4 className="text-lg font-semibold mb-3">Benefits</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {job.benefits.map((b, i) => (
                                                                <div key={i} className="bg-secondary/50 p-3 rounded-lg text-sm">
                                                                    {b}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>
                                            <div className="p-6 border-t mt-auto bg-background">
                                                <Button className="w-full text-lg h-12" onClick={() => setIsApplying(true)}>
                                                    Apply for this Position
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        /* Application Form */
                                        <>
                                            <DialogHeader className="p-6 pb-2">
                                                <DialogTitle>Apply for {job.title}</DialogTitle>
                                                <DialogDescription>Please complete the form below. We'll be in touch soon.</DialogDescription>
                                            </DialogHeader>
                                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                                <form id="application-form" onSubmit={handleApplySubmit} className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="full_name">Full Name *</Label>
                                                            <Input id="full_name" name="full_name" required />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="email">Email *</Label>
                                                            <Input id="email" name="email" type="email" required />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="phone">Phone *</Label>
                                                            <Input id="phone" name="phone" required />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="linkedin_profile">LinkedIn URL</Label>
                                                            <Input id="linkedin_profile" name="linkedin_profile" type="url" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="portfolio_url">Portfolio URL</Label>
                                                        <Input id="portfolio_url" name="portfolio_url" type="url" placeholder="https://" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="resume">Resume / CV *</Label>
                                                        <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer relative ${resumeName ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50 border-input'}`}>
                                                            <Input
                                                                id="resume"
                                                                name="resume"
                                                                type="file"
                                                                required
                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                                accept=".pdf,.doc,.docx"
                                                                onChange={handleFileChange}
                                                            />
                                                            <div className="flex flex-col items-center gap-2">
                                                                {resumeName ? (
                                                                    <>
                                                                        <CheckCircle2 className="h-8 w-8 text-primary" />
                                                                        <p className="text-sm font-semibold text-primary">{resumeName}</p>
                                                                        <p className="text-xs text-muted-foreground">Click to change file</p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                                                        <p className="text-sm font-medium">Click to Upload Resume</p>
                                                                        <p className="text-xs text-muted-foreground">PDF, DOCX up to 10MB</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="cover_letter">Cover Letter</Label>
                                                        <Textarea id="cover_letter" name="cover_letter" placeholder="Tell us why you're a great fit..." className="min-h-[150px]" />
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="p-6 border-t mt-auto gap-4 flex bg-background">
                                                <Button variant="outline" className="flex-1" onClick={() => setIsApplying(false)}>Back</Button>
                                                <Button type="submit" form="application-form" className="flex-1" disabled={loading}>
                                                    {loading ? "Submitting..." : "Submit Application"}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 p-12 bg-primary/5 rounded-2xl text-center">
                    <h3 className="text-2xl font-bold mb-4">Don't see your role?</h3>
                    <p className="text-muted-foreground mb-8">
                        We're always looking for talent. Send your resume to <span className="font-bold text-foreground">careers@voguex.com</span> and we'll keep you on file.
                    </p>
                </div>
            </div>
        </div>
    )
}
