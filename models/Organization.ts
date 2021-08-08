export class Organization {
    address: string;
    name: string;
    owner: string;
    slug: string;

    constructor (name:string, address:string, owner:string, slug:string) {
        this.name = name
        this.address = address
        this.owner = owner
        this.slug = slug
    }
}
