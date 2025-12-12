import { useContext } from "react";

import { tutorCreateQuizFormContext } from "@/contexts/tutor-quiz-form-provider";

export function useTutorQuizFormProvider() {
    const createQuizContext = useContext(tutorCreateQuizFormContext);

    if (createQuizContext === null) {
        throw new Error("Create Quiz Context Used Outside of its scope.");
    }

    return createQuizContext;
}
