export default ({ app }, inject) => {
    const getJsonLdFile = (files) => {
        const jsonLd = {
            '@context': {
                '@version': 1.1,
                '@base': '',
                '@vocab': 'https://tropy.org/v1/tropy#',
                template: {
                    '@type': '@id'
                },
                photo: {
                    '@id': 'https://tropy.org/v1/tropy#photo',
                    '@container': '@list'
                },
                note: {
                    '@id': 'https://tropy.org/v1/tropy#note',
                    '@container': '@list'
                },
                selection: {
                    '@id': 'https://tropy.org/v1/tropy#selection',
                    '@container': '@list'
                },
                title: 'http://purl.org/dc/elements/1.1/title',
                date: {
                    '@id': 'http://purl.org/dc/elements/1.1/date',
                    '@type': 'https://tropy.org/v1/tropy#date'
                },
                creator: 'http://purl.org/dc/elements/1.1/creator'
            },
            '@graph': [],
            version: '1.15.2'
        }

        files.forEach((file) => {
            jsonLd['@graph'].push({
                '@type': 'Item',
                template: 'https://tropy.org/v1/templates/generic',
                title: file.label,
                creator: file.user_id,
                photo: [
                    {
                        '@type': 'Photo',
                        checksum: 'unknown',
                        mimetype: 'unknown',
                        path: `${file.label}`,
                        template: 'https://tropy.org/v1/templates/photo',
                        title: file.label
                    }
                ]
            })
        })

        return jsonLd
    }

    inject('getJsonLdFile', getJsonLdFile)
}
