/**
 * Retrieves a unique timestamp from an ID.
 *
 * @param id - The ID to retrieve the timestamp from.
 * @returns The unique timestamp.
 */
export default (id?: string | null | undefined) => {
 if (!id) return Date.now();
 if (id.length === 13) return parseInt(id, 10);
 return parseInt(id, 36);
};
