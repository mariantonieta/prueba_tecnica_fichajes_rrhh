export const useToast = () => {
    const toast = ({ title, description, variant }: { title: string; description?: string; variant?: "destructive" | "default" }) => {
        alert(`${title}${description ? ": " + description : ""}`)
    }

    return { toast }
}
