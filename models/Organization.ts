import firebase from "firebase/app";

const COLLECTION = 'organization'

export class Organization {
    id: string;
    name: string;
    address: string;
    owner: string;
    slug: string;

    constructor (id='', name='', address='', owner='', slug='') {
        this.id = id
        this.name = name
        this.address = address
        this.owner = owner
        this.slug = slug
    }

    /**
     * Gets the current/active Firestore Instance
     * @returns
     */
    public getInstance() {
        return firebase.app().firestore()
    }

    static fromSnapshot(document: firebase.firestore.DocumentSnapshot): Organization{
        return new Organization(
            document.id,
            document.data()?.name,
            document.data()?.address,
            document.data()?.owner,
            document.data()?.slug
        );
    }

    /**
     * toFirestore()
     */
    public toFirestore(): object {
        return {
            name: this.name,
            address: this.address,
            owner: this.owner,
            slug: this.slug
        }
    }

    /**
     * Save Organization
     * Wrapper/Traffic function for create() and update()
     */
    public save(){
        return this.id === '' ? this.create() : this.update();
    }

    /**
     * Delete Organization
     */
    public delete(){
        let db = this.getInstance()
        return db.collection(COLLECTION).doc(this.id).delete()
    }

    /**
     * Generates an ID and creates a new organization
     * from our properties.
     */
    private create(){
        let db = this.getInstance()
        let docRef = db.collection(COLLECTION).doc();
        this.id = docRef.id
        return docRef.set(this.toFirestore())
    }

    /**
     * Updates an existing organization
     */
    private update(){
        let db = this.getInstance()
        return db.collection(COLLECTION).doc(this.id).set(this.toFirestore())
    }


}
