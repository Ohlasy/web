{-# LANGUAGE OverloadedStrings #-}

module Analytics (
    AnalyticsResponse(..),
    parseAnalyticsResponse
) where

import Data.Aeson
import Control.Monad
import qualified Data.ByteString.Lazy.Char8 as L8

data AnalyticsResponse = AnalyticsResponse {
    analyticsResponseRows :: [[String]]
} deriving (Show, Eq)

instance FromJSON AnalyticsResponse where
    parseJSON (Object value) = AnalyticsResponse <$> value .: "rows"
    parseJSON _ = mzero

parseAnalyticsResponse :: L8.ByteString -> Maybe AnalyticsResponse
parseAnalyticsResponse = decode
