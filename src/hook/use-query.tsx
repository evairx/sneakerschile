import { useState,  useEffect} from "preact/hooks";

export const useQuery = ( query:string ) => {
    const [matches, setMatches] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        setMatches(media.matches);

        const listener = () => setMatches(media.matches);
        window.addEventListener("resize", listener);

        setHasMounted(true);
        return () => window.removeEventListener("resize", listener);
    }, [query]);

    return hasMounted ? matches : false;
};