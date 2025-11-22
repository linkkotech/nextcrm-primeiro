import { notFound } from "next/navigation";
import { getProfileBySlug } from "@/services/public-profile.actions";
import { ProfileRenderer } from "@/components/public-profile/ProfileRenderer";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{
        slug: string;
        locale: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const profile = await getProfileBySlug(slug);

    if (!profile) {
        return {
            title: "Perfil não encontrado",
        };
    }

    return {
        title: `${profile.user.name} | NextCRM`,
        description: `Entre em contato com ${profile.user.name}.`,
    };
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { slug } = await params;
    const profile = await getProfileBySlug(slug);

    if (!profile) {
        notFound();
    }

    return <ProfileRenderer profile={profile} />;
}
