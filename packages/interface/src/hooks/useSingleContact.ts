import { useState } from "react";
import { renderEmail } from "../helpers/renderEmail";
import { TEmailComponent } from "../types/types";
import { ContactI3C } from "../types/typesI3C";

type UseSingleContactArgs = {
    Component: TEmailComponent;
};

function useSingleContact({ Component }: UseSingleContactArgs) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const contact: ContactI3C = {
        uid: Date.now(),
        name,
        email,
        nation: "",
        institution: "",
        sentDate: "",
        updatedDate: "",
    };

    const emailText = renderEmail(Component, { name: contact.name });

    return {
        name,
        setName,
        email,
        setEmail,
        emailText,
        contact,
    };
}

export { useSingleContact };
