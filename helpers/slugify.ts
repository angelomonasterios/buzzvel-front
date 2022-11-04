
export const slugify = (term: string) => {
    return term
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
};
