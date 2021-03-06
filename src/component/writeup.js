import React from 'react';

const Writeup = (props) => (
    <><h1>Metroam</h1>
    <h2>Joseph Kaming-Thanassi, Matthew Rollender, Khalil Haji</h2>

<p>With metroam, we originally set out to make software that would allow the consumer to make an informed choice about what method of transit was quickest or cost the most. However, we realized that visualizing this data would have more interesting prospects for analysis. How does distance effect trip time? Are there major points of congestion for ride sharing or public transit? Are those congestion centers correlated between both modes? The possibilities for analysis go on and on. For that reason, we believe that this analysis and visualization will be a useful tool for urban planners, civil engineers, government officials, or anyone that has a vested interest in improving transit infrastructure for all.
</p>
<h2>Challenges</h2>
<h3>Data Collection/API</h3>
<p>In completing our project, we encountered some challenges. The most difficult part of our plan was the data collection itself. We planned and succeeded at performing hourly data collection for one week. We ended up using data from the Google Maps Distance Matrix and Lyft APIs. We had originally planned on using Uber and Lyft, however, using two very similar ride-sharing platforms could take focus away from our main goal of comparing ride-sharing with public transit by introducing comparisons between two competing services. Additionally, since the Uber API's were rate limited to 500 requests per hour, and we would have to use two separate endpoints to get the same amount of data that Lyft was providing with one endpoint, we were unable to use Uber as a data source . The Lyft API had a far more generous rate limit as well at 10,000 requests per hour.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </p>
<p>On the subject of API's, the limiting factor for the Google Maps Distance Matrix api was pricing. We would have loved to use a more uniform distribution of points, however, Google Maps raised their prices by about 10 times last year. We were able to use their monthly free credit along with a free trial subscription to avoid having to pay out of pocket, however, we were forced to limit the number of points sampled to avoid exceeding our free credit. We settled on a circular distribution with 4 lines extending from an origin point. We sampled every 500 meters for a 4 mile radius in each direction.
</p>
<p>Another challenge was scheduling the data collection itself. We planned on running our collection program every hour for one week. We were able to use a python library that allowed us to schedule tasks at intervals of our choosing. We ran our scheduler on a DigitalOcean droplet in the cloud running 24/7. As the scheduling itself requires minimum computation, the cost of the droplet was close to nothing. We started the scheduler on Tuesday, April 9th. We ran into one hiccup when our droplet was unable to connect to the internet, causing us to miss a few hours of data. Fortunately, we realized the program had timed out before too much time had elapsed and were able to restart the data collection successfully.
</p>
<p>The timing of our data collection was extremely fortunate as Lyft recently scheduled an update to their API which would have complicated our data collection by revoking our API key. Our week of data collection ended before the updates were executed, having no impact on our project.
</p>
<h3>Deck.gl limitations</h3>

<p>While the Deck.GL visualization is visually appealing, it presented a number of limitations when we decided to load our data into it. An early discovery we made was that the visualization we chose -- the HexagonLayer -- is actually made for a number of discrete events. The only way to input data into this specific visualization type is to list the latitudes and longitudes of some number of discrete events. Of course, our data does not represent discrete events but some variable price for each geographical location. This required us to massage our data to match the input contract of Deck.gl. We created duplicate entries for each ten cents of price of each ride. So if a ride from Northeastern to Fenway costs $3.40, our data would tell Deck.gl that there were 34 discrete events that occurred at the Fenway location. This would properly scale the height of each hexagon to reflect the pricing.
</p>
<p>This caused some issues with our visualization. First, our data files were now much larger. Performance of the application became a concern when loading this huge amount of data into the browser for Deck.gl. Second, we had to introduce some rounding into our data set that we would have liked to avoid. We rounded to the nearest ten cents (or in the case of timing, the nearest ten minutes) which painted an inaccurate picture of the data we collected. We had higher precision data we would have liked to show to the viewer, but the medium we chose limited this.
</p>
<p>We found it a bit misleading for Deck.GL to label the HexagonLayer as a “heatmap”. If it were a true heatmap, there would be ways for us to introduce variable amounts for geographical regions rather than just discrete events. There are a number of applications where one would prefer this functionality over discrete events.
</p>

<h2>Analysis</h2>
<h3>Airport (origin and destination)</h3>

<p>It was clear that prices were much higher for trips that terminated at Logan airport. This may be because of fees associated with operating Lyft at the airport, surging prices to take advantage of the travelers, or both. The trip durations starting at the airport also differed from what we had initially expected. There were some points that had a lower trip time than the points further away from it. We believe the reason for this to be I-93. To get from the airport to South Boston via car, one must exit I-90 and take surface streets to get anywhere in South Boston. To get to UMass Boston or anywhere slightly south of South Boston, one may take I-93 which takes less time than it does to navigate the surface streets near the convention center into South Boston despite it being a further distance. Public transit trip durations to the airport were much longer than to other places as well. This could be due to the transfers between the blue line and the terminal shuttle bus or the constant traffic on the arrivals road.
</p>
<h3>Special Events</h3>

<p>We also noticed that the marathon raised trip durations by a small amount but did not increase the price of lyft trips. Had our sampling been more uniform, there may have been an even larger increase in trip time as we didnt have any points along route 135 where the marathon was taking place.
</p>
<h3>Harvard (origin)</h3>

<p>Harvard trip durations were fairly uninteresting for Lyft. The trip times we saw were linearly correlated with the distance, with no real spikes of note. For the transit times, since the red line runs from boston directly to harvard, we noticed that the trip times were generally lower than the lyft equivalent.
</p>
<h3>Northeastern (origin)</h3>

<p>The duration of Lyft trips from Northeastern were generally linear with the exception of trips to the airport which were consistently longer. There were rises and falls corresponding to peak traffic times each day. Transit duration on the other hand was consistent in the inner city, but fluctuated in the suburbs. Most notably, West Roxbury is approximately one hour away by Orange Line + Bus, however, the commuter rail only takes half an hour. We saw a drop in transit times to West Roxbury at the times when a commuter rail train was departing. Given the scarcity of commuter rail departures when compared to the subway and bus, it makes sense that taking the commuter rail is not always an option. Additionally, it is faster to get to West Roxbury than it is to get to some closer destinations in that direction due to the placement of commuter rail stations.
</p>
<h3>City Hall (Origin)</h3>
<p>Trips originating from city hall had few, if any, interesting patterns or spikes in trip time or cost. What we do see is that the airport trip times and prices are so high that the other data becomes very small as a result of the normalization that deck.gl automatically does.
</p>
<h3>Pricing</h3>

<p>We found some interesting patterns in the data when analyzing our visualization. Firstly, pricing for lyft seems to be "tiered". This means that the price stays fairly consistent between certain distance bounds and then goes to the next price bracket when you exceed the bounds. For example, Northeastern is one bracket away from downtown Boston. Getting from Northeastern to anywhere is Fenway, the Back Bay, or the South End has a relatively similar cost, however, getting to Downtown is a step more expensive. We had originally thought that their pricing would be linearly correlated with distance but that is not the case. This is a relevant observation given that the MBTA has considered distance based fares on the T that would work with a fare-zone system. It would be interesting to see if the MBTA chooses similar fare-zones to what ridesharing services currently use to determine their pricing.
</p>
<h2>Blue Sky</h2>

<p>Had we been unencumbered with time and money, we would have make this visualization be available in real time and in anywhere in the world. We would achieve this by using the same API's--this time including Uber--but doing the data analysis and collection in the browser, in real time. Another useful addition would be a map that better shows the roads and transit stops than the one we are currently using. MapBox allows for this customization but charges for the privilege of doing so. Visualizing individual routes would be another useful addition to see the problems with the current infrastructure. This would position the software as more of a tool for commuters rather than urban planners. With that being said, it would be used by urban planners and city government as a real time congestion mapping tool.
</p>
    <h2>Conclusion</h2>

<p>During this project, we hit some major challenges. However, we worked through them to make useful software that visualizes the relations and differentials between public transit and ride sharing. We see all sorts of patterns popping up that can be used to influence change in the Boston transportation infrastructure. What we have developed is a model for transportation-infrastructure analysis, but the blue sky approach would be far more useful in the real world.
</p>
<h2>Group Roles</h2>
        <h3>Joseph Kaming-Thanassi:</h3>
<p>Worked primarily on the data sampling algorithm and the data processing algorithms. Since the data we were receiving was in JSON format and the data the front end was taking was lists of coordinates, the data was translated into lists of coordinates, with multiples of a single point relating to the weight it receives in the visualization. Additionally, some tricky math had to be done to get a radial point sampling in the lat/long coordinate space. Special formulae had to be used to correctly and uniformly shift distances.
</p>
        <h3>Khalil Haji:</h3>
    <p>Worked primarily on the data collection from the API's. This involved writing a Lyft API handler for python--this did not exist prior--using the Google Maps python package, and writing a scheduler to gather data from these API's at hourly intervals. Coordinated the git repository for the data collection. Set up a cloud server to use for data collection. Maintained the collection service for one week which involved ensuring that the data being collected was being saved correctly periodically throughout the day.
    </p>
        <h3>Matthew Rollender:</h3>
    <p>Worked primarily on the front-end visualization. Since Matt had the most experience with web frameworks and technologies, he did the bulk of the work making the website and getting the visualization working. Used Deck.gl, React, Bootstrap, and Github Pages to get the site up and running. Investigated different approaches for preparing data for Deck.gl; developed a React module to quickly load collected data and update the visualization on the fly. Loading our results in a performant manner was important for us to compare our data at different points of time. The time scrubber on the visualization had to quickly and efficiently pull data from our data store to allow us to draw conclusions about our data set.
    </p>
    </>);

export default Writeup;