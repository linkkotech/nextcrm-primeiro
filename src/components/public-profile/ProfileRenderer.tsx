import { LeadCaptureForm } from "./LeadCaptureForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProfileRendererProps {
    profile: any; // Typed as any for now, should be DigitalProfile with relations
}

export function ProfileRenderer({ profile }: ProfileRendererProps) {
    const user = profile.user;
    // Assuming content has some structure, but for MVP just showing basic user info
    // and the lead capture form.

    return (
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
            {/* Header / Cover Area */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 w-full"></div>

            <div className="px-6 -mt-12 mb-6 flex flex-col items-center">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={user.image || ""} alt={user.name || "Avatar"} />
                    <AvatarFallback>{user.name?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
                </Avatar>

                <h1 className="mt-4 text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500">{user.email}</p>
                {user.celular && <p className="text-gray-500 text-sm">{user.celular}</p>}
            </div>

            <div className="px-6 space-y-6 pb-10">
                {/* Bio / About (Placeholder) */}
                <div className="text-center text-gray-600">
                    <p>Olá! Sou {user.name}. Entre em contato comigo para saber mais sobre nossos produtos.</p>
                </div>

                <Separator />

                {/* Lead Capture Section */}
                <Card className="border-none shadow-md bg-gray-50">
                    <CardHeader>
                        <CardTitle className="text-center text-lg">Vamos conversar?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LeadCaptureForm profileId={profile.id} />
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center text-xs text-gray-400 mt-8">
                    Powered by NextCRM
                </div>
            </div>
        </div>
    );
}
