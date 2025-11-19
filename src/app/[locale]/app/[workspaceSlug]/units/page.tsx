import React from "react";
import { getWorkspaceUnits, getWorkspaceTemplatesAndAddresses } from "@/actions/unit.actions";
import { UnitsClient } from "./units-client";

interface PageProps {
    params: Promise<{
        workspaceSlug: string;
        locale: string;
    }>;
}

export default async function UnitsPage({ params }: PageProps) {
    const { workspaceSlug } = await params;
    const [units, { templates, addresses }] = await Promise.all([
        getWorkspaceUnits(workspaceSlug),
        getWorkspaceTemplatesAndAddresses(workspaceSlug),
    ]);

    return (
        <UnitsClient
            units={units}
            templates={templates}
            addresses={addresses}
            workspaceSlug={workspaceSlug}
        />
    );
}
