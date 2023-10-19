CREATE OR REPLACE FUNCTION get_voted_songs(p_playlist_id text, p_location_id text)
RETURNS TABLE (
    spotify_id text,
    added_by text,
    author text,
    image_path text,
    title text,
    preview_url text,
    playlist_id text,
    location_id text,
    up_votes bigint,
    down_votes bigint,
    total_votes bigint
) AS $$
BEGIN
    RETURN QUERY 
    SELECT
        s.spotify_id,
        s.added_by as added_by,
        s.author as author,
        s.image_path as image_path,
        s.title as title,
        s.preview_url as preview_url,
        sv.playlist_id,
        sv.location_id,
        SUM(CASE WHEN sv.vote = 1 THEN 1 ELSE 0 END) AS up_votes,
        SUM(CASE WHEN sv.vote = -1 THEN 1 ELSE 0 END) AS down_votes,
        SUM(sv.vote) AS total_votes
    FROM songs_votes sv
    JOIN songs s ON s.spotify_id = sv.song_spotify_id
    WHERE sv.playlist_id = p_playlist_id AND sv.location_id = p_location_id
    GROUP BY 
        s.spotify_id, 
        s.added_by, 
        s.author, 
        s.image_path, 
        s.title, 
        s.preview_url, 
        sv.playlist_id, 
        sv.location_id
    ORDER BY total_votes DESC
    LIMIT 100;
END;
$$ LANGUAGE plpgsql;
