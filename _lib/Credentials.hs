{-# LANGUAGE OverloadedStrings #-}

module Credentials (
    OAuth2Credentials(..),
    parseOAuth2Credentials,
    loadOAuth2Credentials
) where

import Data.Yaml
import Control.Monad
import Data.ByteString.Char8 (pack)
import Data.Monoid

data OAuth2Credentials = OAuth2Credentials {
    getClientID :: String,
    getClientSecret :: String
} deriving (Show, Eq)

instance FromJSON OAuth2Credentials where
    parseJSON (Object value) = OAuth2Credentials <$>
        value .:  "clientID" <*>
        value .:  "clientSecret"
    parseJSON _ = mzero

parseOAuth2Credentials :: String -> Maybe OAuth2Credentials
parseOAuth2Credentials source = Data.Yaml.decode $ pack source

loadOAuth2Credentials :: FilePath -> IO (Maybe OAuth2Credentials)
loadOAuth2Credentials path = do
    source <- readFile path
    return $ parseOAuth2Credentials source
