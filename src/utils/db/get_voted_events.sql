CREATE OR REPLACE FUNCTION get_voted_events(p_location_id text)
RETURNS TABLE (
    id bigint,
    label text,
    venue text,
    location_link text,
    image_path text,
    event_site text,
    start_time timestamptz,
    classes_included text,
    end_time timestamptz,
    event_location text,
    total_votes bigint
) AS $$
BEGIN
    RETURN QUERY 
    SELECT
        e.id,
        e.label,
        e.venue,
        e.location_link,
        e.image_path,
        e.event_site,
        e.start_time,
        e.classes_included,
        e.end_time,
        e.event_location,
        COUNT(ev.vote) AS total_votes
    FROM events e
    LEFT JOIN events_votes ev ON e.id = ev.event_id
    WHERE e.event_location = p_location_id AND e.end_time > NOW()
    GROUP BY 
        e.id,
        e.label,
        e.venue,
        e.location_link,
        e.image_path,
        e.event_site,
        e.start_time,
        e.classes_included,
        e.end_time,
        e.event_location
    ORDER BY total_votes DESC
    LIMIT 100;
END;
$$ LANGUAGE plpgsql;
