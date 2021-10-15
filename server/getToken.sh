CLIENT_ID=b138eemzacv03igu3v2oghh5ynnwhz
CLIENT_SECRET=f8028did8rt1bopt9fkteexo2zfeqh

DATA=`curl -d client_id=$CLIENT_ID \
           -d client_secret=$CLIENT_SECRET \
           -d grant_type=client_credentials \
           -s https://id.twitch.tv/oauth2/token`
echo $DATA
ACCESS_TOKEN="echo $DATA" | jq .access_token
