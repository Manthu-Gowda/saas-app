import os
import re

directory = 'server/controllers'

for filename in os.listdir(directory):
    if not filename.endswith('.js'):
        continue
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r') as f:
        content = f.read()

    # We need to add the import statement at the top
    if 'import { sendResponse, sendPaginatedResponse }' not in content:
        content = "import { sendResponse, sendPaginatedResponse } from '../utils/response.js';\n" + content

    # We need to replace res.json(data) or res.status(xxx).json(data)
    # But wait, there's so many edge cases in regex for nested objects.
    # It might be easier to use a simple node script using AST or regex.
