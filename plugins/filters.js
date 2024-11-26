export default defineNuxtPlugin(nuxtApp => {
    // You can alternatively use this format, which comes with automatic type support
    return {
        provide: {
            filters: {
                normalDate: function (value) {
                    if (!value) { return '' }

                    const d = new Date(value)
                    return `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()}`
                },
                normalDateAndTime: function (value) {
                    if (!value) { return '' }

                    const d = new Date(value)
                    return `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()} ${d.toLocaleTimeString()}`
                },
                shortDateAndTime: function (value) {
                    if (!value) { return '' }

                    const d = new Date(value)
                    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                },
                timeRemainingGivenHours: function (value, hours = 48) {
                    const now = new Date();
                    const futureDate = new Date(value);
                    futureDate.setHours(futureDate.getHours() + hours);

                    const timeDiff = futureDate - now;
                    if (timeDiff <= 0) {
                        return 'Expired';
                    }

                    const hoursRemaining = Math.floor(timeDiff / (1000 * 60 * 60));
                    const minutesRemaining = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

                    return `${hoursRemaining}h ${minutesRemaining}m remaining`;
                }
            }
        }
    }
})