export class ProductService {
    static async getArtworks(page: number = 1, size: number = 5) {
        const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${size}`);
        const data = await response.json();
        return {
            artworks: data.data, 
            total: data.pagination.total, 
        };
    }
}
