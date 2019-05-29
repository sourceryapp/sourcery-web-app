
export const Utils = {

    /**
     * Get First Name
     * Assumes str is a full name
     * "Brian Daley" would return "Brian"
     */
    getFirstName: str => str.split(' ').slice(0, -1).join(' '),

    /**
    * Get Last Name
    * Assumes str is a full name
    * "Brian Daley" would return "Daley"
    */
    getLastName: str => str.split(' ').slice(-1).join(' '),

    /**
     * Builds a query string from an object of parameters
     */
    buildQueryString: params => Object.keys(params).map(key => key + '=' + params[key]).join('&'),

}
