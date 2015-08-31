import Credentials
import Analytics
import Network.Google.OAuth2
import Network.HTTP.Conduit
import Network.HTTP.Types (hAuthorization)
import Data.Monoid
import qualified Data.ByteString.Char8 as B8

topReadArticlesQueryURL = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A97173197&start-date=30daysAgo&end-date=yesterday&metrics=ga%3Ausers%2Cga%3Apageviews&dimensions=ga%3ApagePath%2Cga%3ApageTitle&sort=-ga%3Apageviews&filters=ga%3ApagePath%3D%40%2Fclanky%2F20&max-results=10"

main :: IO ()
main = do
    accessToken <- getAnalyticsAccessToken
    case accessToken of
        Just token -> do
            response <- runAnalyticsQuery token topReadArticlesQueryURL
            case response of
                Just response -> putStrLn $ renderTopArticleQueryResponse response
                Nothing -> putStrLn "Error parsing the server response."
        Nothing -> do
            putStrLn "Error parsing the analytics credentials file."

getAnalyticsAccessToken :: IO (Maybe OAuth2Token)
getAnalyticsAccessToken = do
    creds <- loadOAuth2Credentials credentialsFile
    case creds of
        Just creds -> do
            let client = OAuth2Client (getClientID creds) (getClientSecret creds)
            token <- getAccessToken client authScope (Just tokenCacheFile)
            return $ Just token
        Nothing -> return Nothing
    where
        authScope = ["https://www.google.com/analytics/feeds/"]
        credentialsFile = ".analytics-credentials.yml"
        tokenCacheFile = ".analytics-token.yml"

runAnalyticsQuery :: OAuth2Token -> String -> IO (Maybe AnalyticsResponse)
runAnalyticsQuery token queryURL = do
    request <- parseUrl queryURL
    response <- withManager $ httpLbs $ authorize token request
    return $ parseAnalyticsResponse $ responseBody response
    where
        authorize token request = request {
            requestHeaders = [(hAuthorization, B8.pack $ "Bearer " <> token)]
        }

renderTopArticleQueryResponse :: AnalyticsResponse -> String
renderTopArticleQueryResponse response = joinRows $ map renderRow $ filterRows rows
    where
        joinRows = foldl (++) ""
        renderRow r = "- title: \"" ++ r!!1 ++ "\"\n  url: \"" ++ r!!0 ++ "\"\n"
        filterRows = filter (\x -> x!!1 /= "(not set)")
        rows = analyticsResponseRows response
