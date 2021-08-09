import firebase from "firebase";
export class Organization {
    id: string;
    name: string;
    address: string;
    owner: string;
    slug: string;

    constructor (id = '', name='', address='', owner='', slug='') {
        this.id = id
        this.name = name
        this.address = address
        this.owner = owner
        this.slug = slug
    }

    static fromSnapshot(document: firebase.firestore.DocumentSnapshot){
        return new Organization(
            document.id,
            document.data()?.name,
            document.data()?.address,
            document.data()?.owner,
            document.data()?.slug
        );
    }
}
