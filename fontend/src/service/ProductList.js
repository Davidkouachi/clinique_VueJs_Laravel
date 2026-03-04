export const ProductService = {
    getProductsData() {
        const baseProducts = [
            {
                id: 1,
                code: 'prod1234',
                nom: 'Montre Rolex 15 quarat',
                img: 'bamboo-watch.jpg',
                prix: 50000000,
                prixReduc: 10000000,
                livraison: 1,
                categoryID: 1,
                category: 'Accessories',
                qte: 40,
                qteLimit: 10,
                dateCreat: '2026-02-20',
                eval: 5
            },
            {
                id: 2,
                code: 'prod5678',
                nom: 'Chaussures Nike Air Max',
                img: 'black-watch.jpg',
                prix: 85000,
                prixReduc: 65000,
                livraison: 1,
                categoryID: 2,
                category: 'Shoes',
                qte: 8,
                qteLimit: 10,
                dateCreat: '2026-01-15',
                eval: 4
            },
            {
                id: 3,
                code: 'prod9101',
                nom: 'Sac à main en cuir Premium',
                img: 'blue-band.jpg',
                prix: 120000,
                prixReduc: 0,
                livraison: 0,
                categoryID: 3,
                category: 'Fashion',
                qte: 0,
                qteLimit: 5,
                dateCreat: '2026-02-01',
                eval: 3
            },
            {
                id: 4,
                code: 'prod1122',
                nom: 'Casque Bluetooth JBL Pro',
                img: 'game-controller.jpg',
                prix: 45000,
                prixReduc: 35000,
                livraison: 1,
                categoryID: 4,
                category: 'Electronics',
                qte: 25,
                qteLimit: 7,
                dateCreat: '2026-02-10',
                eval: 4
            },
            {
                id: 5,
                code: 'prod3344',
                nom: 'Lunettes de soleil Ray-Ban',
                img: 'bracelet.jpg',
                prix: 95000,
                prixReduc: 0,
                livraison: 1,
                categoryID: 1,
                category: 'Accessories',
                qte: 5,
                qteLimit: 10,
                dateCreat: '2026-02-18',
                eval: 5
            },
            {
                id: 5,
                code: 'prod3344',
                nom: 'Lunettes de soleil Ray-Ban',
                img: 'bracelet.jpg',
                prix: 95000,
                prixReduc: 0,
                livraison: 1,
                categoryID: 1,
                category: 'Informatique',
                qte: 5,
                qteLimit: 10,
                dateCreat: '2026-02-18',
                eval: 5
            }
        ];

        const bigList = [];

        for (let i = 0; i < 100; i++) {
            const p = baseProducts[i % baseProducts.length];

            bigList.push({
                ...p,
                id: `${i}`,
                nom: `${p.nom} #${i}`
            });
        }

        return bigList;
    },

    getProductsPaginated(offset = 0, limit = 20) {
        const data = this.getProductsData(); // ← doit être un tableau

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data.slice(offset, offset + limit));
            }, 1500);
        });
    },

    getProducts() {
        return new Promise((resolve) => {
            const data = this.getProductsData();
            setTimeout(() => resolve(data), 500); // simule un fetch
        });
    }

};
