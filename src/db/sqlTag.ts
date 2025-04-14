import { QueryConfig } from 'pg';

export const sql = (chunks: TemplateStringsArray, ...keys: unknown[]): QueryConfig => {
    const text = [chunks[0]];
    const values: unknown[] = [];
    let index = 1;

    keys.forEach((key, keyIndex) => {
        const nextChunkIndex = keyIndex + 1;
        if (Array.isArray(key)) {
            const textParts: string[] = [];
            key.forEach((item) => {
                values.push(item);
                textParts.push(`$${index}`);
                index += 1;
            });

            text.push(textParts.join(', '), chunks[nextChunkIndex]);
            return;
        }

        values.push(key);
        text.push(`$${index}`, chunks[nextChunkIndex]);
        index += 1;
    });

    return {
        text: text.join(''),
        values,
    };
};
