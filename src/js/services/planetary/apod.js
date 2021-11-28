const request = require('../request')

module.exports = {
  /**
   * @desc APOD
   * @desc One of the most popular websites at NASA is the Astronomy Picture of the Day.
   * @param {Date} [options.date] The date of the APOD image to retrieve
   * @param {Date} [options.start_date] The start of a date range, when requesting date for a range of dates. Cannot be used with date.
   * @param {Date} [options.end_date] The end of the date range, when used with start_date.
   * @param {number} [options.count] 	If this is specified then count randomly chosen images will be returned. Cannot be used with date or start_date and end_date.
   * @param {boolean} [options.thumbs] Return the URL of video thumbnail. If an APOD is not a video, this parameter is ignored.
   * @returns {Promise<AxiosResponse<any>>}
   */
  get: (options = {}) =>
    request.get('/planetary/apod', { params: {
      ...options,
      date: options.date && new Date(options.date).toISOString().split('T')[0],
      start_date: options.start_date && new Date(options.start_date).toISOString().split('T')[0],
      end_date: options.end_date && new Date(options.end_date).toISOString().split('T')[0],
    }}
  )
}
