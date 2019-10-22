/**
 * listens for user login, then updates the
 * user location in the store
 */
import { locationUpdater } from '~/plugins/location-updater'
export const plugins = [ locationUpdater ]

export const strict = false
