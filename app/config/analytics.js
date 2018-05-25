import { Analytics, PageHit } from 'expo-analytics';

//TODO: Change ID
let google_analytics_id = '';

let analytics = new Analytics(google_analytics_id);

let track = screen => analytics.hit(new PageHit(screen));

export default track;