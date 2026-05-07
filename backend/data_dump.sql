SELECT 
    s.id AS session_id,
    s.user_id,
    u.nickname,
    u.email,
    s.phpsession,
    s.cohort,
    s.team_id,
    t.name AS team_name,
    t.type AS team_type,
    s.survey_id,
    o.question_id,
    o.question_option_id,
    o.time_spent,
    o.is_correct,
    s.started_at,
    s.completed_at,
    s.created_at,
    s.ip,
    s.browser
FROM synapse.survey_sessions AS s
JOIN synapse.teams AS t
    ON s.team_id = t.id
-- LEFT JOIN to get sessions that had teams but never answered a question
LEFT JOIN synapse.survey_session_options AS o 
    ON s.id = o.survey_session_id
-- LEFT JOIN to keep sessions that dont have nickname
LEFT JOIN synapse.users AS u
    ON s.user_id = u.id
WHERE s.survey_id = '7219'
    AND s.started_at IS NOT NULL
    AND s.deleted_at IS NULL
    AND s.is_duplicate = 0
    AND s.team_id IS NOT NULL;

