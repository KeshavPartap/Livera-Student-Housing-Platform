// Centralized Data Store for LivEra Listings
function getLivEraListings() {
    // FORCE CLEAR for updated image paths
    localStorage.removeItem('livEraListings');

    const stored = localStorage.getItem('livEraListings');
    if (stored) return JSON.parse(stored);

    // Initial 10 Provided Properties Seed — with real uploaded listing images
    const seed = [
        {
            id: 0,
            title: 'Agastyas PG',
            type: 'PG',
            rent: 8500,
            status: 'AVAILABLE',
            views: 124,
            inqs: 5,
            tier: 'low',
            img: 'assets/listings/dx.jpeg',
            fb: 'assets/listings/new1.jpeg',
            meta: 'Pathare Wasti · 1.5 km',
            lat: 18.4620,
            lng: 73.9885,
            tags: ['PG', '1 RK'],
            amenities: 'wifi,meals',
            beds: '1 RK · Shared',
            price: '₹8,500'
        },
        {
            id: 1,
            title: 'Zolo Noble',
            type: 'PG',
            rent: 10500,
            status: 'AVAILABLE',
            views: 310,
            inqs: 12,
            tier: 'med',
            img: 'assets/listings/img1.jpeg',
            fb: 'assets/listings/new2.jpeg',
            meta: 'Malimala Rd · 0.8 km',
            lat: 18.4512,
            lng: 73.9910,
            tags: ['PG', '1 BHK'],
            amenities: 'wifi,meals,laundry',
            beds: '1 BHK · Attached',
            price: '₹10,500'
        },
        {
            id: 2,
            title: 'H25 Premium Stay Boys PG',
            type: 'Hostel',
            rent: 9500,
            status: 'AVAILABLE',
            views: 184,
            inqs: 8,
            tier: 'low',
            img: 'assets/listings/jhb.jpeg',
            fb: 'assets/listings/new3.jpeg',
            meta: 'Chintamani Park · 1.2 km',
            lat: 18.4550,
            lng: 73.9850,
            tags: ['Hostel', '1 BHK'],
            amenities: 'wifi,parking',
            beds: '1 BHK · Boys Only',
            price: '₹9,500'
        },
        {
            id: 3,
            title: 'Shivsuman Boys Hostel PG',
            type: 'Hostel',
            rent: 7500,
            status: 'RENTED',
            views: 340,
            inqs: 15,
            tier: 'low',
            img: 'assets/listings/img2.jpeg',
            fb: 'assets/listings/new4.jpeg',
            meta: 'Kadamwak Wasti · 2.5 km',
            lat: 18.4680,
            lng: 73.9780,
            tags: ['Hostel', '1 RK'],
            amenities: 'parking',
            beds: '1 RK · Budget',
            price: '₹7,500'
        },
        {
            id: 4,
            title: 'Luxury Girls & Boys Hostel PG',
            type: 'Hostel',
            rent: 11000,
            status: 'AVAILABLE',
            views: 450,
            inqs: 22,
            tier: 'med',
            img: 'assets/listings/img4.jpeg',
            fb: 'assets/listings/new5.jpeg',
            meta: 'Loni Station · 0.5 km',
            lat: 18.4480,
            lng: 73.9950,
            tags: ['Hostel', '2 BHK'],
            amenities: 'wifi,meals,ac',
            beds: '2 BHK · Premium',
            price: '₹11,000'
        },
        {
            id: 5,
            title: 'Everest Hills PG',
            type: 'PG',
            rent: 8500,
            status: 'AVAILABLE',
            views: 90,
            inqs: 2,
            tier: 'low',
            img: 'assets/listings/54.jpeg',
            fb: 'assets/listings/new6.jpeg',
            meta: 'Raywadi Road · 3.0 km',
            lat: 18.4720,
            lng: 73.9700,
            tags: ['PG', '1 RK'],
            amenities: 'wifi,parking',
            beds: '1 RK · Shared',
            price: '₹8,500'
        },
        {
            id: 6,
            title: 'The ARK Boys Hostel',
            type: 'Hostel',
            rent: 9500,
            status: 'BOOKED',
            views: 210,
            inqs: 9,
            tier: 'low',
            img: 'assets/listings/img5.jpeg',
            fb: 'assets/listings/new7.jpeg',
            meta: 'Rahinj Nagar · 1.8 km',
            lat: 18.4600,
            lng: 73.9900,
            tags: ['Hostel', '1 BHK'],
            amenities: 'wifi',
            beds: '1 BHK · Boys Only',
            price: '₹9,500'
        },
        {
            id: 7,
            title: 'Shree Living Hostels PG',
            type: 'PG',
            rent: 9500,
            status: 'AVAILABLE',
            views: 115,
            inqs: 4,
            tier: 'low',
            img: 'assets/listings/img6.jpeg',
            fb: 'assets/listings/new8.jpeg',
            meta: 'MIT College Rd · 0.2 km',
            lat: 18.4530,
            lng: 73.9870,
            tags: ['PG', '1 BHK'],
            amenities: 'wifi,meals',
            beds: '1 BHK · Shared',
            price: '₹9,500'
        },
        {
            id: 8,
            title: 'Chintamani Living PG',
            type: 'PG',
            rent: 10500,
            status: 'AVAILABLE',
            views: 130,
            inqs: 6,
            tier: 'med',
            img: 'assets/listings/img7.jpeg',
            fb: 'assets/listings/new9.jpeg',
            meta: 'MIT College Rd · 0.3 km',
            lat: 18.4520,
            lng: 73.9860,
            tags: ['PG', '1 BHK'],
            amenities: 'wifi,meals',
            beds: '1 BHK · Co-living',
            price: '₹10,500'
        },
        {
            id: 9,
            title: 'Anuja 2 Boys Hostel',
            type: 'Hostel',
            rent: 7500,
            status: 'AVAILABLE',
            views: 85,
            inqs: 1,
            tier: 'low',
            img: 'assets/listings/img8.jpeg',
            fb: 'assets/listings/new10.jpeg',
            meta: 'Kadamwak Wasti · 2.0 km',
            lat: 18.4650,
            lng: 73.9800,
            tags: ['Hostel', '1 RK'],
            amenities: 'parking',
            beds: '1 RK · Budget',
            price: '₹7,500'
        }
    ];

    localStorage.setItem('livEraListings', JSON.stringify(seed));
    return seed;
}

function saveLivEraListing(newProp) {
    const data = getLivEraListings();
    data.unshift(newProp);
    localStorage.setItem('livEraListings', JSON.stringify(data));
}
