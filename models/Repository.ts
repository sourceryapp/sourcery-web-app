import firebase from "firebase/app";

const COLLECTION = 'repository'



export class Repository {

    id?: string;
    address1?: string;
    address2?: string;
    city?: string;
    country_code?: string;
    geo?: string;
    institution?: string;
    name?: string;
    postal_code?: string;
    secondary_location?: string;
    state?: string;

    /**
     * Gets the current/active Firestore Instance
     * @returns
     */
    public getInstance() {
        return firebase.app().firestore()
    }

    static fromSnapshot(document: firebase.firestore.DocumentSnapshot): Repository{
        let repository = new Repository();
        repository.id = document.id;
        repository.address1 = document.data()?.address1
        repository.address2 = document.data()?.address2
        repository.city = document.data()?.city
        repository.country_code = document.data()?.country_code
        repository.geo = document.data()?.geo
        repository.institution = document.data()?.institution
        repository.name = document.data()?.name
        repository.postal_code = document.data()?.postal_code
        repository.secondary_location = document.data()?.secondary_location
        repository.state = document.data()?.state
        return repository
    }

    /**
     * toFirestore()
     */
    public toFirestore(): object {

        return {

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
