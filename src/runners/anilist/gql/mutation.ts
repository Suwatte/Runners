export const MediaListEntryMutation = `
 mutation (
          $id: Int
          $mediaId: Int
          $status: MediaListStatus
          $score: Int
          $progress: Int
          $progressVolumes: Int
          $repeat: Int
          $private: Boolean
          $notes: String
          $customLists: [String]
          $hiddenFromStatusLists: Boolean
          $startedAt: FuzzyDateInput
          $completedAt: FuzzyDateInput
        ) {
          SaveMediaListEntry(
            id: $id
            mediaId: $mediaId
            status: $status
            scoreRaw: $score
            progress: $progress
            progressVolumes: $progressVolumes
            repeat: $repeat
            private: $private
            notes: $notes
            customLists: $customLists
            hiddenFromStatusLists: $hiddenFromStatusLists
            startedAt: $startedAt
            completedAt: $completedAt
          ) {
                  mediaId
          }
        }
`;
