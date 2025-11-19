import React from "react";
import { getWorkspaceAddresses } from "@/actions/address.actions";
import { AddressesClient } from "./addresses-client";

interface PageProps {
    params: {
        workspaceSlug: string;
        locale: string;
    };
}

export default async function AddressesPage({ params }: PageProps) {
    const addresses = await getWorkspaceAddresses(params.workspaceSlug);

    return (
        <AddressesClient
            addresses={addresses}
            workspaceSlug={params.workspaceSlug}
        />
    );
}
