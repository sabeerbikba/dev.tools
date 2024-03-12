import { Suspense } from "react";
import Fallback from "../pages/Fallback";

export default function useSuspenseWithFallback(component) {
    return (
        <Suspense fallback={<Fallback />}>
            {component}
        </Suspense>
    );
}