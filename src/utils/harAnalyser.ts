import { readFileSync, writeFileSync } from 'fs'
// Types for findings
type SlowRequest = Record<'url' | 'method'  | 'timestamp', string> & Record<'waitTime', number>
type LargePayload = Record<'url' | 'method' | 'totalSize' | 'timestamp', string> 
type ErrorResponse = Record<'url' | 'method' | 'status' | 'errorMessage' | 'timestamp', string>

// Initialize findings
const findings = {
  slowRequests: [] as SlowRequest[],
  largePayloads: [] as LargePayload[],
  errorResponses: [] as ErrorResponse[],
};

// Analyze HAR entries
export const analyzeHAR = async (harFilePath: string, htmlOututPath: string) => {
  const harData = JSON.parse(readFileSync(harFilePath, 'utf-8'))
  harData.log.entries.forEach((entry: { request: any; response: any; timings: any; startedDateTime: any }) => {
    const { request, response, timings, startedDateTime } = entry
    const { method, url } = request
    const { status, statusText, headersSize, bodySize } = response

    // Identify slow requests (e.g., > 1 second)
    if (timings.wait > 1000) {
      findings.slowRequests.push({
        url,
        method,
        waitTime: timings.wait,
        timestamp: startedDateTime,
      })
    }

    // Identify large payloads (e.g., > 1 MB)
    const totalSize = headersSize + bodySize
    if (totalSize > 1024 * 1024) {
      findings.largePayloads.push({
        url,
        method,
        totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
        timestamp: startedDateTime,
      })
    }

    // Identify error responses (status codes 4xx and 5xx)
    if (status >= 400) {
      findings.errorResponses.push({
        url,
        method,
        status,
        errorMessage: statusText || 'N/A',
        timestamp: startedDateTime,
      })
    }
  })

  // Generate HTML report
interface GenerateHTMLData {
    slowRequests: SlowRequest[]
    largePayloads: LargePayload[]
    errorResponses: ErrorResponse[]
}

interface GenerateHTML {
    (data: GenerateHTMLData): string
}

const generateHTML: GenerateHTML = (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Analysis Report</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <header class="bg-success text-white py-4 text-center">
        <h1 class="display-4">Comprehensive API Data Analysis Report</h1>
    </header>
    <main class="container my-5">
        <section class="mb-4">
            <h2 class="h4 text-success">Summary</h2>
            <p class="text-muted">
                This report provides a detailed analysis of the provided HAR file, highlighting slow requests, large payloads, and error responses.
            </p>
        </section>
        <section>
            <h2 class="h4 text-success">Slow Requests</h2>
            <div class="table-responsive">
                <table class="table table-bordered table-striped">
                    <thead class="table-success">
                        <tr>
                            <th scope="col">URL</th>
                            <th scope="col">Method</th>
                            <th scope="col">Wait Time (ms)</th>
                            <th scope="col">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.slowRequests
                            .map(
                                (req: SlowRequest) => `
                                <tr>
                                    <td class="text-break" style="max-width: 300px;">${req.url}</td>
                                    <td>${req.method}</td>
                                    <td>${req.waitTime}</td>
                                    <td>${req.timestamp}</td>
                                </tr>
                            `,
                            )
                            .join('')}
                    </tbody>
                </table>
            </div>
        </section>
        <section>
            <h2 class="h4 text-success">Large Payloads</h2>
            <div class="table-responsive">
                <table class="table table-bordered table-striped">
                    <thead class="table-success">
                        <tr>
                            <th scope="col">URL</th>
                            <th scope="col">Method</th>
                            <th scope="col">Size</th>
                            <th scope="col">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.largePayloads
                            .map(
                                (payload: LargePayload) => `
                                <tr>
                                    <td class="text-break" style="max-width: 300px;">${payload.url}</td>
                                    <td>${payload.method}</td>
                                    <td>${payload.totalSize}</td>
                                    <td>${payload.timestamp}</td>
                                </tr>
                            `,
                            )
                            .join('')}
                    </tbody>
                </table>
            </div>
        </section>
        <section>
            <h2 class="h4 text-success">Error Responses</h2>
            <div class="table-responsive">
                <table class="table table-bordered table-striped">
                    <thead class="table-success">
                        <tr>
                            <th scope="col">URL</th>
                            <th scope="col">Method</th>
                            <th scope="col">Status</th>
                            <th scope="col">Error Message</th>
                            <th scope="col">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.errorResponses
                            .map(
                                (error: ErrorResponse) => `
                                <tr>
                                    <td class="text-break" style="max-width: 300px;">${error.url}</td>
                                    <td>${error.method}</td>
                                    <td>${error.status}</td>
                                    <td>${error.errorMessage}</td>
                                    <td>${error.timestamp}</td>
                                </tr>
                            `,
                            )
                            .join('')}
                    </tbody>
                </table>
            </div>
        </section>
    </main>
    <footer class="bg-success text-white py-3 text-center">
        <p class="mb-0">&copy; 2025 Comprehensive Data Analysis</p>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`

  // Write the HTML report to a file
  const htmlContent = generateHTML(findings)
  writeFileSync(htmlOututPath, htmlContent, 'utf-8')
  console.log('Data analysis report generated successfully')
}