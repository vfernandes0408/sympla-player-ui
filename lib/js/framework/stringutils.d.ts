import { PlayerAPI } from 'bitmovin-player';
export declare namespace StringUtils {
    let FORMAT_HHMMSS: string;
    let FORMAT_MMSS: string;
    /**
     * Formats a number of seconds into a time string with the pattern hh:mm:ss.
     *
     * @param totalSeconds the total number of seconds to format to string
     * @param format the time format to output (default: hh:mm:ss)
     * @returns {string} the formatted time string
     */
    function secondsToTime(totalSeconds: number, format?: string): string;
    function secondsToText(totalSeconds: number): string;
    /**
     * Fills out placeholders in an ad message.
     *
     * Has the placeholders '{remainingTime[formatString]}', '{playedTime[formatString]}' and
     * '{adDuration[formatString]}', which are replaced by the remaining time until the ad can be skipped, the current
     * time or the ad duration. The format string is optional. If not specified, the placeholder is replaced by the time
     * in seconds. If specified, it must be of the following format:
     * - %d - Inserts the time as an integer.
     * - %0Nd - Inserts the time as an integer with leading zeroes, if the length of the time string is smaller than N.
     * - %f - Inserts the time as a float.
     * - %0Nf - Inserts the time as a float with leading zeroes.
     * - %.Mf - Inserts the time as a float with M decimal places. Can be combined with %0Nf, e.g. %04.2f (the time
     * 10.123 would be printed as 0010.12).
     * - %hh:mm:ss
     * - %mm:ss
     *
     * Examples:
     * - { text: 'Ad: {remainingTime%mm:ss} secs' }
     * An input value of 100 would be displayed as: 'Ad: 01:40 secs'
     * - { text: 'Ad: {remainingTime%f} secs' }
     * An input value of 100 would be displayed as: 'Ad: 100.0 secs'
     *
     * @param adMessage an ad message with optional placeholders to fill
     * @param skipOffset if specified, {remainingTime} will be filled with the remaining time until the ad can be skipped
     * @param player the player to get the time data from
     * @returns {string} the ad message with filled placeholders
     */
    function replaceAdMessagePlaceholders(adMessage: string, skipOffset: number, player: PlayerAPI): string;
}
