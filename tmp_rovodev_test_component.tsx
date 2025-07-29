import MarkdownRenderer from './components/MarkdownRenderer';

const testMarkdown = `### 🧑‍💻 User

Can you show me a table and some code examples?

### 🤖 Assistant

Here's a comparison table:

| Feature | Light Mode | Dark Mode | Status |
|---------|------------|-----------|--------|
| Tables | ✅ Supported | ✅ Supported | Working |
| Code Blocks | ✅ Proper colors | ✅ Fixed colors | Fixed |
| Syntax Highlighting | ✅ Good contrast | ✅ Good contrast | Working |

And here's some code that should have proper styling:

\`\`\`javascript
function calculateTotal(items) {
    return items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);
}

const cart = [
    { name: "Apple", price: 1.50, quantity: 3 },
    { name: "Banana", price: 0.75, quantity: 6 }
];

console.log("Total:", calculateTotal(cart));
\`\`\`

\`\`\`python
def fibonacci_sequence(n):
    """Generate fibonacci sequence up to n terms"""
    sequence = []
    a, b = 0, 1
    
    for i in range(n):
        sequence.append(a)
        a, b = b, a + b
    
    return sequence

# Test the function
result = fibonacci_sequence(10)
print(f"First 10 fibonacci numbers: {result}")
\`\`\`

The table should be properly styled with borders and hover effects, and the code blocks should have appropriate colors for both light and dark modes.`;

export default function TestComponent() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Markdown Table and Code Block Test</h1>
      <MarkdownRenderer content={testMarkdown} />
    </div>
  );
}