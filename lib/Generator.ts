import ProgressBar from 'progress'
import downloadGitRepo from 'download-git-repo'

class Generator {
  url: string;
  constructor(requestUrl: string) {
    this.url = requestUrl
  }

  download() {
    // ProgressBar.tick()
  }
}

export default Generator