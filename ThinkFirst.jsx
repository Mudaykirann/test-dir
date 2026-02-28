import { useState, useEffect, createContext, useContext, useCallback } from "react";

// ============================================================
// CODE BLOCK RENDERER
// ============================================================
function CodeBlock({ code, language = "python" }) {
  const keywords = ["if", "else", "elif", "for", "while", "in", "and", "or", "not", "True", "False", "None", "print", "return", "def", "class", "import", "range", "len", "break", "continue", "pass", "yield", "try", "except", "lambda", "map", "list", "let", "const", "var", "true", "false", "null", "function", "typeof"];

  const tokenize = (line) => {
    const tokens = [];
    let rem = line;
    while (rem.length > 0) {
      const strM = rem.match(/^(['"`][^'"`\n]*['"`])/);
      if (strM) { tokens.push({ type: "string", text: strM[1] }); rem = rem.slice(strM[1].length); continue; }
      const numM = rem.match(/^(\b\d+\b)/);
      if (numM) { tokens.push({ type: "number", text: numM[1] }); rem = rem.slice(numM[1].length); continue; }
      if (rem[0] === "#" || rem.startsWith("//")) { tokens.push({ type: "comment", text: rem }); break; }
      const kwM = keywords.find(kw => new RegExp(`^(${kw})(?=[^a-zA-Z0-9_]|$)`).test(rem));
      if (kwM) { tokens.push({ type: "keyword", text: kwM }); rem = rem.slice(kwM.length); continue; }
      const opM = rem.match(/^([+\-*/%=<>!&|^~(){}\[\]:,. ]+)/);
      if (opM) { tokens.push({ type: "op", text: opM[1] }); rem = rem.slice(opM[1].length); continue; }
      const idM = rem.match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (idM) { tokens.push({ type: "ident", text: idM[1] }); rem = rem.slice(idM[1].length); continue; }
      tokens.push({ type: "text", text: rem[0] }); rem = rem.slice(1);
    }
    return tokens;
  };

  const colors = { keyword: "#c792ea", string: "#c3e88d", number: "#f78c6c", comment: "#546e7a", op: "#89ddff", ident: "#eeffff", text: "#eeffff" };

  return (
    <div style={{ background: "#0d1117", borderRadius: 10, padding: "16px 20px", fontFamily: "'Fira Code','Cascadia Code','Consolas',monospace", fontSize: 13.5, lineHeight: 1.85, overflowX: "auto", marginBottom: 20, border: "1px solid #30363d" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ display: "inline-flex", gap: 5 }}>
          {["#ff5f57","#febc2e","#28c840"].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />)}
        </span>
        <span style={{ color: "#6e7681", fontSize: 11, fontFamily: "system-ui" }}>Python</span>
      </div>
      {code.split("\n").map((line, li) => (
        <div key={li} style={{ display: "flex" }}>
          <span style={{ color: "#3d4451", width: 26, flexShrink: 0, textAlign: "right", marginRight: 14, fontSize: 11, paddingTop: 1, userSelect: "none" }}>{li + 1}</span>
          <span style={{ flex: 1 }}>
            {tokenize(line).map((t, ti) => <span key={ti} style={{ color: colors[t.type] }}>{t.text}</span>)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// EXERCISES — 20 per level, all code-based
// ============================================================
const EXERCISES = {
  beginner: [
    {
      id: "b1", type: "multiChoice", title: "Simple Addition",
      code: `x = 5\ny = 3\nprint(x + y)`,
      question: "What does this code print?",
      options: ["53", "8", "xy", "Error"],
      correct: 1,
      explanation: "x = 5 and y = 3 are numbers. The + operator adds them: 5 + 3 = 8. print(8) outputs 8. If they were strings, + would concatenate — but integers use numeric addition."
    },
    {
      id: "b2", type: "trueFalse", title: "Age Gate",
      code: `age = 17\nif age >= 18:\n    print("Access granted")\nelse:\n    print("Access denied")`,
      question: 'Does this code print "Access granted"?',
      correct: false,
      explanation: "age = 17. Condition: age >= 18 means 'greater than OR equal to 18'. 17 >= 18 is False. The else branch runs instead, printing 'Access denied'."
    },
    {
      id: "b3", type: "multiChoice", title: "String Multiplication",
      code: `word = "hi"\nprint(word * 3)`,
      question: "What is the output?",
      options: ["hi hi hi", "hihihi", "3", "hihi"],
      correct: 1,
      explanation: "In Python, multiplying a string by an integer repeats it. 'hi' * 3 = 'hihihi'. No spaces are added automatically — the string is concatenated with itself 3 times."
    },
    {
      id: "b4", type: "trueFalse", title: "AND Logic",
      code: `has_ticket = True\nhas_id = False\nif has_ticket and has_id:\n    print("Enter")\nelse:\n    print("Denied")`,
      question: 'Does this code print "Enter"?',
      correct: false,
      explanation: "AND requires BOTH sides to be True. has_ticket = True ✓, but has_id = False ✗. True and False evaluates to False. The if block is skipped, printing 'Denied'."
    },
    {
      id: "b5", type: "multiChoice", title: "List Length",
      code: `fruits = ["apple", "banana", "mango"]\nprint(len(fruits))`,
      question: "What does this print?",
      options: ["2", "3", "4", "apple"],
      correct: 1,
      explanation: "len() counts the number of elements in a list. fruits has 3 items: 'apple', 'banana', 'mango'. So len(fruits) = 3."
    },
    {
      id: "b6", type: "trueFalse", title: "Strict Greater Than",
      code: `password = "hello123"\nif len(password) > 8:\n    print("Strong")\nelse:\n    print("Weak")`,
      question: 'Does this print "Strong"?',
      correct: false,
      explanation: '"hello123" has exactly 8 characters. The condition is len > 8 (strictly greater, not equal). 8 > 8 is False. So it prints "Weak". Use >= 8 if 8 characters should be accepted.'
    },
    {
      id: "b7", type: "multiChoice", title: "OR Logic",
      code: `is_student = False\nhas_coupon = True\nif is_student or has_coupon:\n    print("Discount!")\nelse:\n    print("Full price")`,
      question: "What is printed?",
      options: ["Full price", "Discount!", "True", "Error"],
      correct: 1,
      explanation: "OR only needs ONE condition to be True. is_student = False, but has_coupon = True. False or True = True. The if block runs, printing 'Discount!'."
    },
    {
      id: "b8", type: "multiChoice", title: "Step-by-Step Variables",
      code: `score = 10\nscore = score + 5\nscore = score * 2\nprint(score)`,
      question: "What does this print?",
      options: ["10", "15", "30", "25"],
      correct: 2,
      explanation: "Trace each line: score starts at 10 → score = 10+5 = 15 → score = 15*2 = 30. print(score) prints 30. Variables update their own value using the previous value."
    },
    {
      id: "b9", type: "trueFalse", title: "NOT Operator",
      code: `is_raining = False\nif not is_raining:\n    print("Go outside!")`,
      question: 'Does this print "Go outside!"?',
      correct: true,
      explanation: "not flips a boolean value. is_raining = False. not False = True. The condition is True, so 'Go outside!' is printed. not is used to reverse/negate a condition."
    },
    {
      id: "b10", type: "multiChoice", title: "Zero Indexing",
      code: `colors = ["red", "green", "blue"]\nprint(colors[1])`,
      question: "What is printed?",
      options: ["red", "green", "blue", "1"],
      correct: 1,
      explanation: "Python lists are zero-indexed. Index 0 = 'red', index 1 = 'green', index 2 = 'blue'. colors[1] accesses the second element, which is 'green'."
    },
    {
      id: "b11", type: "multiChoice", title: "Integer Division",
      code: `a = 10\nb = 3\nprint(a // b)`,
      question: "What does this print?",
      options: ["3.33", "3", "1", "0"],
      correct: 1,
      explanation: "// is floor division — it divides and throws away the decimal. 10 / 3 = 3.33..., but 10 // 3 = 3 (rounded down). Use / for float division and // for whole-number division."
    },
    {
      id: "b12", type: "trueFalse", title: "Modulo Remainder",
      code: `number = 15\nif number % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")`,
      question: 'Does this print "Even"?',
      correct: false,
      explanation: "% is the modulo operator — it gives the remainder after division. 15 % 2 = 1 (since 15 = 2×7 + 1). 1 == 0 is False, so the else runs and prints 'Odd'."
    },
    {
      id: "b13", type: "multiChoice", title: "Type Check",
      code: `x = "42"\nprint(type(x))`,
      question: "What is printed?",
      options: ["int", "<class 'int'>", "<class 'str'>", "42"],
      correct: 2,
      explanation: "type() returns the data type of a value. x = \"42\" is a string (text wrapped in quotes), not a number. So type(x) is <class 'str'>. int(x) would convert it to the number 42."
    },
    {
      id: "b14", type: "trueFalse", title: "String Concatenation",
      code: `first = "Hello"\nsecond = "World"\nprint(first + " " + second)`,
      question: 'Does this print "Hello World"?',
      correct: true,
      explanation: "The + operator on strings joins them together (concatenation). \"Hello\" + \" \" + \"World\" = \"Hello World\". The space \" \" in the middle adds a gap between the two words."
    },
    {
      id: "b15", type: "multiChoice", title: "Negative Index",
      code: `items = [10, 20, 30, 40, 50]\nprint(items[-1])`,
      question: "What is printed?",
      options: ["10", "40", "50", "-1"],
      correct: 2,
      explanation: "Negative indices count from the end. -1 is the last element, -2 is second-to-last, etc. items[-1] = 50. This is a Python shortcut to access the tail of a list without knowing its length."
    },
    {
      id: "b16", type: "trueFalse", title: "Boolean From Comparison",
      code: `x = 10\nresult = x == 10\nprint(result)`,
      question: "Does this print True?",
      correct: true,
      explanation: "== is the equality comparison operator (not assignment =). x == 10 asks 'is x equal to 10?' Since x is 10, the answer is True. result stores the boolean True, which is then printed."
    },
    {
      id: "b17", type: "multiChoice", title: "Input Conversion",
      code: `num = int("25")\nprint(num + 5)`,
      question: "What is printed?",
      options: ["255", "30", "25 + 5", "Error"],
      correct: 1,
      explanation: "int(\"25\") converts the string \"25\" to the integer 25. Then 25 + 5 = 30. Without int(), \"25\" + 5 would crash (can't add string and int). Always convert input strings before arithmetic."
    },
    {
      id: "b18", type: "trueFalse", title: "Elif Chain",
      code: `temp = 25\nif temp > 35:\n    print("Hot")\nelif temp > 20:\n    print("Warm")\nelse:\n    print("Cold")`,
      question: 'Does this print "Warm"?',
      correct: true,
      explanation: "temp = 25. First check: 25 > 35? No. elif check: 25 > 20? Yes! Prints 'Warm' and stops — elif/else branches are skipped once a True condition is found."
    },
    {
      id: "b19", type: "multiChoice", title: "List Update",
      code: `nums = [1, 2, 3]\nnums[0] = 99\nprint(nums)`,
      question: "What is printed?",
      options: ["[1, 2, 3]", "[99, 2, 3]", "[99]", "Error"],
      correct: 1,
      explanation: "nums[0] = 99 replaces the element at index 0 with 99. Lists are mutable — you can change their elements directly. The rest of the list stays the same: [99, 2, 3]."
    },
    {
      id: "b20", type: "trueFalse", title: "Empty String Check",
      code: `name = ""\nif name:\n    print("Hello", name)\nelse:\n    print("No name provided")`,
      question: 'Does this print "Hello "?',
      correct: false,
      explanation: "An empty string \"\" is falsy in Python — it evaluates to False in a boolean context. So the if condition fails, and the else runs printing 'No name provided'. Empty strings, 0, None, and [] are all falsy."
    },
  ],

  intermediate: [
    {
      id: "i1", type: "multiChoice", title: "For Loop Sum",
      code: `total = 0\nfor i in range(5):\n    total = total + i\nprint(total)`,
      question: "What does this print?",
      options: ["5", "10", "15", "4"],
      correct: 1,
      explanation: "range(5) produces [0,1,2,3,4]. Loop adds: 0+0=0, 0+1=1, 1+2=3, 3+3=6, 6+4=10. Final total = 10. Note: range(5) starts at 0 and does NOT include 5."
    },
    {
      id: "i2", type: "trueFalse", title: "While Loop Boundary",
      code: `count = 0\nwhile count < 3:\n    print(count)\n    count = count + 1`,
      question: "Does this code print the number 3?",
      correct: false,
      explanation: "Loop runs while count < 3. It prints 0, 1, 2. When count becomes 3, condition 3 < 3 is False — loop ends before printing 3. Output: 0, 1, 2."
    },
    {
      id: "i3", type: "multiChoice", title: "Nested If",
      code: `age = 20\nhas_id = True\nif age >= 18:\n    if has_id:\n        print("Welcome!")\n    else:\n        print("Need ID")\nelse:\n    print("Too young")`,
      question: "What is printed?",
      options: ["Too young", "Need ID", "Welcome!", "Error"],
      correct: 2,
      explanation: "Outer check: age >= 18 → 20 >= 18 ✓. Inner check: has_id → True ✓. Both pass, so 'Welcome!' is printed. Nested ifs work like a checklist — all outer conditions must pass first."
    },
    {
      id: "i4", type: "trueFalse", title: "Append Effect",
      code: `nums = [1, 2, 3]\nnums.append(4)\nprint(len(nums))`,
      question: "Does this print 4?",
      correct: true,
      explanation: "append() adds one element to the end of the list. nums starts with 3 items. After append(4), nums = [1,2,3,4] with 4 elements. len(nums) = 4. ✓"
    },
    {
      id: "i5", type: "multiChoice", title: "Function Return Value",
      code: `def double(n):\n    return n * 2\n\nresult = double(7)\nprint(result)`,
      question: "What is printed?",
      options: ["7", "2", "14", "n * 2"],
      correct: 2,
      explanation: "double(7) calls the function with n=7. It returns 7 * 2 = 14. This value is stored in result. print(result) prints 14."
    },
    {
      id: "i6", type: "multiChoice", title: "String Slicing",
      code: `text = "Python"\nprint(text[0:3])`,
      question: "What is printed?",
      options: ["Pyt", "yth", "Python", "Py"],
      correct: 0,
      explanation: "Slicing [start:end] extracts from index start up to (not including) end. text[0:3] takes indices 0,1,2 = 'P','y','t' = 'Pyt'. The end index is always exclusive."
    },
    {
      id: "i7", type: "trueFalse", title: "Break Statement",
      code: `for i in range(10):\n    if i == 5:\n        break\n    print(i)`,
      question: "Does this code print the number 5?",
      correct: false,
      explanation: "break exits the loop immediately. When i == 5, break fires before print(i). So only 0,1,2,3,4 are printed. 5 never gets printed because break comes first."
    },
    {
      id: "i8", type: "multiChoice", title: "Dictionary Access",
      code: `student = {"name": "Aisha", "grade": 90}\nprint(student["grade"])`,
      question: "What is printed?",
      options: ["Aisha", "90", "grade", "name"],
      correct: 1,
      explanation: "A dict stores key→value pairs. student[\"grade\"] looks up the value for key 'grade', which is 90. Dictionaries use meaningful string keys to label their data."
    },
    {
      id: "i9", type: "trueFalse", title: "Chained Comparison",
      code: `score = 75\nif 60 <= score < 80:\n    print("Grade: C")`,
      question: 'Does this print "Grade: C"?',
      correct: true,
      explanation: "Python allows chained comparisons. 60 <= 75 < 80 means (60 <= 75) AND (75 < 80). Both are True ✓. The condition passes and 'Grade: C' is printed."
    },
    {
      id: "i10", type: "multiChoice", title: "List Comprehension Filter",
      code: `nums = [1, 2, 3, 4, 5]\nevens = [n for n in nums if n % 2 == 0]\nprint(evens)`,
      question: "What is printed?",
      options: ["[1, 3, 5]", "[2, 4]", "[1, 2, 3, 4, 5]", "[0, 2, 4]"],
      correct: 1,
      explanation: "% is modulo (remainder after division). n % 2 == 0 selects even numbers. From [1,2,3,4,5]: 2%2=0 ✓, 4%2=0 ✓. 1,3,5 are odd. Result: [2, 4]."
    },
    {
      id: "i11", type: "multiChoice", title: "Default Parameter",
      code: `def greet(name, msg="Hello"):\n    print(msg, name)\n\ngreet("Alice")\ngreet("Bob", "Hi")`,
      question: "What are the two lines of output?",
      options: ["Hello Alice / Hello Bob", "Hello Alice / Hi Bob", "Alice Hello / Bob Hi", "Error"],
      correct: 1,
      explanation: "Default parameters are used when no argument is passed. greet(\"Alice\") uses msg's default \"Hello\" → prints 'Hello Alice'. greet(\"Bob\", \"Hi\") overrides the default → prints 'Hi Bob'."
    },
    {
      id: "i12", type: "trueFalse", title: "String in Operator",
      code: `sentence = "The quick brown fox"\nprint("quick" in sentence)`,
      question: "Does this print True?",
      correct: true,
      explanation: "The in operator checks if a substring exists inside a string. \"quick\" is indeed a part of \"The quick brown fox\", so the result is True. This works for both strings and lists."
    },
    {
      id: "i13", type: "multiChoice", title: "Enumerate",
      code: `fruits = ["apple", "banana", "cherry"]\nfor i, fruit in enumerate(fruits):\n    print(i, fruit)\n# What is the FIRST line printed?`,
      question: "What is the very first line printed?",
      options: ["1 apple", "0 apple", "apple 0", "0 banana"],
      correct: 1,
      explanation: "enumerate() pairs each item with its index, starting from 0. First iteration: i=0, fruit='apple'. print(0, 'apple') outputs '0 apple'. It's a clean way to loop with both index and value."
    },
    {
      id: "i14", type: "trueFalse", title: "Continue Statement",
      code: `for i in range(5):\n    if i == 3:\n        continue\n    print(i)`,
      question: "Does this code print the number 3?",
      correct: false,
      explanation: "continue skips the rest of the loop body for that iteration and moves to the next. When i==3, continue runs — print(i) is skipped. Output: 0, 1, 2, 4. Unlike break, continue doesn't exit the loop."
    },
    {
      id: "i15", type: "multiChoice", title: "Dict Keys",
      code: `person = {"name": "Sam", "age": 25, "city": "Delhi"}\nprint(list(person.keys()))`,
      question: "What is printed?",
      options: ["['Sam', 25, 'Delhi']", "['name', 'age', 'city']", "{'name', 'age', 'city'}", "Error"],
      correct: 1,
      explanation: ".keys() returns the dictionary's keys (not values). list() converts it to a plain list. Result: ['name', 'age', 'city']. Use .values() for values and .items() for both."
    },
    {
      id: "i16", type: "multiChoice", title: "Nested List Access",
      code: `matrix = [[1, 2], [3, 4], [5, 6]]\nprint(matrix[1][0])`,
      question: "What is printed?",
      options: ["2", "3", "4", "1"],
      correct: 1,
      explanation: "matrix[1] accesses the second row: [3, 4]. Then [0] accesses the first element of that row: 3. So matrix[1][0] = 3. This is how 2D data (like grids) is accessed in nested lists."
    },
    {
      id: "i17", type: "trueFalse", title: "Try Except Flow",
      code: `try:\n    x = 10 / 0\n    print("Done")\nexcept ZeroDivisionError:\n    print("Error caught")`,
      question: 'Does this print "Done"?',
      correct: false,
      explanation: "10 / 0 raises a ZeroDivisionError immediately. The rest of the try block (print(\"Done\")) is skipped. The except block catches the error and prints 'Error caught' instead."
    },
    {
      id: "i18", type: "multiChoice", title: "String Methods",
      code: `text = "  hello world  "\nprint(text.strip().upper())`,
      question: "What is printed?",
      options: ["hello world", "HELLO WORLD", "  HELLO WORLD  ", "Hello World"],
      correct: 1,
      explanation: ".strip() removes leading/trailing whitespace: 'hello world'. .upper() converts all characters to uppercase: 'HELLO WORLD'. Methods chain from left to right, each operating on the result of the previous."
    },
    {
      id: "i19", type: "trueFalse", title: "Global vs Local",
      code: `x = 10\n\ndef change():\n    x = 99\n    print(x)\n\nchange()\nprint(x)`,
      question: "Does the final print(x) print 99?",
      correct: false,
      explanation: "Inside change(), x = 99 creates a LOCAL variable that shadows the global x. The global x = 10 is never modified. change() prints 99 (local), then the final print(x) prints 10 (global). To modify global x, use the global keyword."
    },
    {
      id: "i20", type: "multiChoice", title: "Sorted Function",
      code: `nums = [3, 1, 4, 1, 5, 9, 2]\nresult = sorted(nums)\nprint(result[0], result[-1])`,
      question: "What is printed?",
      options: ["3 2", "1 9", "9 1", "1 2"],
      correct: 1,
      explanation: "sorted() returns a NEW sorted list in ascending order: [1, 1, 2, 3, 4, 5, 9]. result[0] is the smallest = 1, result[-1] is the largest = 9. print(1, 9) outputs '1 9'. The original nums list is unchanged."
    },
  ],

  advanced: [
    {
      id: "a1", type: "multiChoice", title: "Recursive Factorial",
      code: `def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(4))`,
      question: "What is printed?",
      options: ["4", "10", "24", "16"],
      correct: 2,
      explanation: "Trace: factorial(4) = 4 * factorial(3) = 4 * 3 * factorial(2) = 4 * 3 * 2 * factorial(1) = 4*3*2*1*factorial(0) = 4*3*2*1*1 = 24. The base case n==0 returns 1 and stops recursion."
    },
    {
      id: "a2", type: "trueFalse", title: "Short-Circuit AND",
      code: `x = 0\nif x != 0 and 10 / x > 2:\n    print("Yes")\nelse:\n    print("No")`,
      question: "Does this code crash with a ZeroDivisionError?",
      correct: false,
      explanation: "Python short-circuits AND: if the first operand is False, the second is never evaluated. x != 0 → False, so 10/x is never computed. No crash — else runs printing 'No'."
    },
    {
      id: "a3", type: "multiChoice", title: "Closure Variable",
      code: `def outer():\n    x = 10\n    def inner():\n        return x + 5\n    return inner()\n\nprint(outer())`,
      question: "What is printed?",
      options: ["5", "10", "15", "Error"],
      correct: 2,
      explanation: "inner() can access x from outer()'s scope — this is called a closure. x = 10 is captured. inner() returns 10 + 5 = 15. outer() returns that result."
    },
    {
      id: "a4", type: "trueFalse", title: "Mutable Default Argument",
      code: `def add_item(item, lst=[]):\n    lst.append(item)\n    return lst\n\nprint(add_item("a"))\nprint(add_item("b"))`,
      question: 'Does the second call print ["b"] only?',
      correct: false,
      explanation: "Classic Python gotcha! The default list [] is created ONCE when the function is defined, not on each call. First call returns ['a']. Second call appends to the SAME list: ['a', 'b']. Always use lst=None as default instead."
    },
    {
      id: "a5", type: "multiChoice", title: "Lambda with Map",
      code: `nums = [1, 2, 3, 4]\nsquared = list(map(lambda x: x ** 2, nums))\nprint(squared)`,
      question: "What is printed?",
      options: ["[1, 4, 9, 16]", "[2, 4, 6, 8]", "[1, 2, 3, 4]", "[1, 8, 27, 64]"],
      correct: 0,
      explanation: "map() applies a function to each element. lambda x: x**2 squares each number. 1²=1, 2²=4, 3²=9, 4²=16. list() converts the map object to [1, 4, 9, 16]."
    },
    {
      id: "a6", type: "trueFalse", title: "ValueError Catch",
      code: `try:\n    result = int("abc")\nexcept ValueError:\n    result = -1\nprint(result)`,
      question: "Does this code print -1?",
      correct: true,
      explanation: 'int("abc") raises a ValueError because "abc" can\'t become an integer. The except block catches it and sets result = -1. print(-1) runs. try/except prevents crashes by handling exceptions gracefully.'
    },
    {
      id: "a7", type: "multiChoice", title: "Generator Yield",
      code: `def gen():\n    for i in range(3):\n        yield i * 2\n\nresult = list(gen())\nprint(result)`,
      question: "What is printed?",
      options: ["[0, 1, 2]", "[0, 2, 4]", "[2, 4, 6]", "[1, 2, 3]"],
      correct: 1,
      explanation: "yield pauses the function and produces a value. For i=0: yields 0, i=1: yields 2, i=2: yields 4. list() collects all yielded values: [0, 2, 4]."
    },
    {
      id: "a8", type: "multiChoice", title: "Decorator Pattern",
      code: `def shout(func):\n    def wrapper():\n        return func().upper()\n    return wrapper\n\n@shout\ndef greet():\n    return "hello"\n\nprint(greet())`,
      question: "What is printed?",
      options: ["hello", "HELLO", "wrapper", "greet"],
      correct: 1,
      explanation: "@shout wraps greet so calling greet() actually calls wrapper(). wrapper() calls the original func() which returns 'hello', then .upper() converts it to 'HELLO'."
    },
    {
      id: "a9", type: "trueFalse", title: "Method Override",
      code: `class Animal:\n    def speak(self):\n        return "..."\n\nclass Dog(Animal):\n    def speak(self):\n        return "Woof"\n\nd = Dog()\nprint(d.speak())`,
      question: 'Does this print "Woof"?',
      correct: true,
      explanation: "Dog inherits from Animal but overrides speak(). When d.speak() is called on a Dog instance, Python finds speak() in Dog first and returns 'Woof'. This is method overriding (polymorphism)."
    },
    {
      id: "a10", type: "multiChoice", title: "Reference vs Copy",
      code: `a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)`,
      question: "What does a contain after this code?",
      options: ["[1, 2, 3]", "[1, 2, 3, 4]", "[4]", "Error"],
      correct: 1,
      explanation: "b = a doesn't copy the list — b and a point to the SAME list in memory. Mutating b (append) also changes a. To avoid this, use b = a.copy() or b = a[:]. Output: [1, 2, 3, 4]."
    },
    {
      id: "a11", type: "multiChoice", title: "Class __init__",
      code: `class Circle:\n    def __init__(self, r):\n        self.radius = r\n    def area(self):\n        return 3.14 * self.radius ** 2\n\nc = Circle(5)\nprint(c.area())`,
      question: "What is printed?",
      options: ["3.14", "25", "78.5", "15.7"],
      correct: 2,
      explanation: "__init__ sets up the object. c = Circle(5) creates a Circle with radius=5. area() returns 3.14 * 5² = 3.14 * 25 = 78.5. self.radius stores instance data — each Circle object has its own radius."
    },
    {
      id: "a12", type: "trueFalse", title: "isinstance Check",
      code: `class Animal: pass\nclass Dog(Animal): pass\n\nd = Dog()\nprint(isinstance(d, Animal))`,
      question: "Does this print True?",
      correct: true,
      explanation: "isinstance() checks if an object is an instance of a class OR any of its parent classes. Dog inherits from Animal, so a Dog instance IS an Animal. isinstance(d, Animal) = True. This reflects inheritance."
    },
    {
      id: "a13", type: "multiChoice", title: "Star Args",
      code: `def total(*nums):\n    return sum(nums)\n\nprint(total(1, 2, 3, 4, 5))`,
      question: "What is printed?",
      options: ["Error", "15", "12345", "(1,2,3,4,5)"],
      correct: 1,
      explanation: "*nums collects all positional arguments into a tuple. total(1,2,3,4,5) → nums = (1,2,3,4,5). sum((1,2,3,4,5)) = 15. *args lets functions accept any number of arguments — very flexible."
    },
    {
      id: "a14", type: "trueFalse", title: "Walrus Operator",
      code: `data = [1, 2, 3, 4, 5]\nif (n := len(data)) > 3:\n    print(f"Long list: {n} items")`,
      question: 'Does this print "Long list: 5 items"?',
      correct: true,
      explanation: ":= is the walrus operator — it assigns AND evaluates in one step. n := len(data) assigns 5 to n and uses 5 in the condition. 5 > 3 is True. The f-string prints 'Long list: 5 items' using the already-computed n."
    },
    {
      id: "a15", type: "multiChoice", title: "Dict Comprehension",
      code: `words = ["cat", "elephant", "ox"]\nlengths = {w: len(w) for w in words}\nprint(lengths["elephant"])`,
      question: "What is printed?",
      options: ["3", "8", "2", "elephant"],
      correct: 1,
      explanation: "Dict comprehension {w: len(w) for w in words} creates {'cat':3, 'elephant':8, 'ox':2}. lengths[\"elephant\"] looks up the length of 'elephant', which is 8 (e-l-e-p-h-a-n-t)."
    },
    {
      id: "a16", type: "trueFalse", title: "Multiple Return Values",
      code: `def min_max(lst):\n    return min(lst), max(lst)\n\nlo, hi = min_max([3, 1, 7, 2, 9])\nprint(lo, hi)`,
      question: "Does this print '1 9'?",
      correct: true,
      explanation: "Python functions can return multiple values as a tuple. min_max returns (1, 9). Tuple unpacking lo, hi = (1, 9) assigns lo=1, hi=9. print(lo, hi) prints '1 9'. This is cleaner than returning a list."
    },
    {
      id: "a17", type: "multiChoice", title: "List Flatten with Chain",
      code: `from itertools import chain\nnested = [[1, 2], [3, 4], [5]]\nflat = list(chain(*nested))\nprint(flat)`,
      question: "What is printed?",
      options: ["[[1,2],[3,4],[5]]", "[1, 2, 3, 4, 5]", "[(1,2),(3,4),(5,)]", "Error"],
      correct: 1,
      explanation: "*nested unpacks the outer list into separate arguments: chain([1,2], [3,4], [5]). chain() lazily iterates through each sub-list in sequence. list() collects them into [1, 2, 3, 4, 5]. This flattens one level deep."
    },
    {
      id: "a18", type: "trueFalse", title: "Property Decorator",
      code: `class Temp:\n    def __init__(self, c):\n        self.celsius = c\n    @property\n    def fahrenheit(self):\n        return self.celsius * 9/5 + 32\n\nt = Temp(100)\nprint(t.fahrenheit)`,
      question: "Does this print 212.0?",
      correct: true,
      explanation: "@property lets you access a method like an attribute (no parentheses). t.fahrenheit calls the method without (). celsius=100 → 100 * 9/5 + 32 = 180 + 32 = 212.0. Properties are great for computed attributes."
    },
    {
      id: "a19", type: "multiChoice", title: "functools Reduce",
      code: `from functools import reduce\nnums = [1, 2, 3, 4, 5]\nresult = reduce(lambda a, b: a * b, nums)\nprint(result)`,
      question: "What is printed?",
      options: ["15", "120", "25", "5"],
      correct: 1,
      explanation: "reduce() applies a function cumulatively: ((((1*2)*3)*4)*5) = 2*3*4*5 = 120. The lambda multiplies pairs. reduce 'folds' the list into a single value. 1*2=2, 2*3=6, 6*4=24, 24*5=120."
    },
    {
      id: "a20", type: "trueFalse", title: "Context Manager",
      code: `class Timer:\n    def __enter__(self):\n        print("Start")\n        return self\n    def __exit__(self, *args):\n        print("Stop")\n\nwith Timer():\n    print("Running")`,
      question: "Does the output order go: Start → Running → Stop?",
      correct: true,
      explanation: "with statements use __enter__ and __exit__ to manage setup/teardown. __enter__ runs first (prints 'Start'), then the body executes (prints 'Running'), then __exit__ runs automatically (prints 'Stop'). This guarantees cleanup even if an error occurs."
    },
  ]
};

// ============================================================
// LOGIC PATH FLOWCHART — shown after solving
// ============================================================
function LogicFlowchart({ exercise }) {
  // Generate flowchart nodes based on exercise type + code analysis
  const buildNodes = () => {
    if (exercise.type === "trueFalse") {
      return {
        type: "if-else",
        condition: exercise.question.replace(/^Does this (code )?print |Does this |[?]$/gi, "").trim().slice(0, 48),
        trueLabel: "True ✓",
        falseLabel: "False ✗",
        trueResult: exercise.correct ? "✅ Correct Path" : "❌ Wrong Path",
        falseResult: exercise.correct ? "❌ Wrong Path" : "✅ Correct Path",
        answer: exercise.correct ? "TRUE" : "FALSE",
      };
    }
    if (exercise.type === "multiChoice") {
      return {
        type: "multi",
        question: exercise.question.slice(0, 60) + (exercise.question.length > 60 ? "…" : ""),
        options: exercise.options.map((opt, i) => ({
          label: opt.length > 30 ? opt.slice(0, 28) + "…" : opt,
          correct: i === exercise.correct,
          letter: ["A","B","C","D"][i],
        })),
      };
    }
    return null;
  };

  const nodes = buildNodes();
  if (!nodes) return null;

  return (
    <div style={{ marginTop: 20, marginBottom: 4 }}>
      <div style={{ fontSize: 12, fontFamily: "monospace", color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <span>⬡</span> Logic Path Visualization
      </div>
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "20px 16px", overflowX: "auto" }}>
        {nodes.type === "if-else" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, minWidth: 300 }}>
            {/* Start */}
            <FlowNode label="START" shape="oval" color="#6366f1" />
            <FlowArrow />
            {/* Condition */}
            <FlowNode label={`if ${nodes.condition}?`} shape="diamond" color="#f59e0b" />
            {/* Branches */}
            <div style={{ display: "flex", gap: 40, position: "relative", marginTop: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <FlowArrow label="TRUE" color="#10b981" />
                <FlowNode label={nodes.trueResult} shape="rect" color={nodes.answer === "TRUE" ? "#10b981" : "#ef4444"} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <FlowArrow label="FALSE" color="#ef4444" />
                <FlowNode label={nodes.falseResult} shape="rect" color={nodes.answer === "FALSE" ? "#10b981" : "#ef4444"} />
              </div>
            </div>
          </div>
        )}
        {nodes.type === "multi" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, minWidth: 340 }}>
            <FlowNode label="Evaluate Expression" shape="oval" color="#6366f1" />
            <FlowArrow />
            <FlowNode label={nodes.question} shape="diamond" color="#f59e0b" maxWidth={220} />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
              {nodes.options.map(opt => (
                <div key={opt.letter} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <FlowArrow label={opt.letter} color={opt.correct ? "#10b981" : "#6b7280"} short />
                  <FlowNode label={opt.correct ? `✅ ${opt.label}` : opt.label} shape="rect" color={opt.correct ? "#10b981" : "#334155"} small />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FlowNode({ label, shape, color, maxWidth = 160, small = false }) {
  const base = {
    background: `${color}22`, border: `2px solid ${color}`, color: "#f1f5f9",
    fontFamily: "system-ui", fontSize: small ? 10 : 11, fontWeight: 600, textAlign: "center",
    padding: small ? "5px 8px" : "8px 14px", maxWidth, wordBreak: "break-word", lineHeight: 1.4,
  };
  if (shape === "oval") return <div style={{ ...base, borderRadius: 999, padding: "7px 20px", fontSize: 11 }}>{label}</div>;
  if (shape === "diamond") {
    return (
      <div style={{ position: "relative", width: maxWidth, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...base, borderRadius: 8, transform: "rotate(0deg)", zIndex: 1 }}>{label}</div>
        <div style={{ position: "absolute", width: "100%", height: "100%", border: `2px solid ${color}40`, borderRadius: 8, transform: "rotate(2deg)", background: "transparent" }} />
      </div>
    );
  }
  return <div style={{ ...base, borderRadius: 7 }}>{label}</div>;
}

function FlowArrow({ label, color = "#475569", short = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, margin: "2px 0" }}>
      {label && <span style={{ fontSize: 10, color: color || "#94a3b8", fontFamily: "monospace", fontWeight: 700 }}>{label}</span>}
      <div style={{ width: 2, height: short ? 14 : 22, background: color || "#334155" }} />
      <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `7px solid ${color || "#334155"}` }} />
    </div>
  );
}

// ============================================================
// TIMER HOOK
// ============================================================
function useTimer() {
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    if (stopped) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 500);
    return () => clearInterval(id);
  }, [startTime, stopped]);

  const stop = useCallback(() => {
    setStopped(true);
    setElapsed(Math.floor((Date.now() - startTime) / 1000));
    return Math.floor((Date.now() - startTime) / 1000);
  }, [startTime]);

  const format = (s) => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;

  return { elapsed, stop, format };
}

// ============================================================
// CONTEXT
// ============================================================
const AppContext = createContext(null);
const defaultProgress = { completedExercises: [], scores: {}, totalScore: 0, times: {} };

function AppProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    try { const s = localStorage.getItem("tf2_progress"); return s ? JSON.parse(s) : defaultProgress; }
    catch { return defaultProgress; }
  });
  const [currentView, setCurrentView] = useState("landing");
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => { localStorage.setItem("tf2_progress", JSON.stringify(progress)); }, [progress]);

  const completeExercise = useCallback((id, correct, pts, solveTime) => {
    setProgress(prev => {
      const already = prev.completedExercises.includes(id);
      return {
        ...prev,
        completedExercises: already ? prev.completedExercises : [...prev.completedExercises, id],
        scores: { ...prev.scores, [id]: Math.max(prev.scores[id] || 0, correct ? pts : 0) },
        totalScore: already ? prev.totalScore : prev.totalScore + (correct ? pts : 0),
        times: { ...prev.times, ...(solveTime != null ? { [id]: solveTime } : {}) },
      };
    });
  }, []);

  const resetProgress = useCallback(() => setProgress(defaultProgress), []);

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const setOn = () => setIsOffline(false);
    const setOff = () => setIsOffline(true);
    window.addEventListener("online", setOn);
    window.addEventListener("offline", setOff);
    return () => { window.removeEventListener("online", setOn); window.removeEventListener("offline", setOff); };
  }, []);

  return (
    <AppContext.Provider value={{ progress, currentView, setCurrentView, selectedLevel, setSelectedLevel, completeExercise, resetProgress, isOffline }}>
      {children}
    </AppContext.Provider>
  );
}
const useApp = () => useContext(AppContext);

// ============================================================
// UI ATOMS
// ============================================================
function ProgressBar({ value, max, color = "#f59e0b" }) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ background: "#e5e7eb", borderRadius: 999, height: 8, overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.6s ease" }} />
    </div>
  );
}

function NavBar({ onHome, onLevels, onProgress, showBack, backLabel = "← Levels" }) {
  const { progress, isOffline } = useApp();
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px", borderBottom: "2px solid #1a1a2e", background: "#fafaf7", position: "sticky", top: 0, zIndex: 100 }}>
      <button onClick={onHome || onLevels} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Georgia", fontWeight: 700, fontSize: 17, color: "#1a1a2e", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, background: "#f59e0b", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15 }}>T</div>
        {showBack ? <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 600 }}>{backLabel}</span> : "ThinkFirst"}
      </button>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {isOffline && (
          <span style={{ background: "#fef3c7", border: "1px solid #f59e0b", color: "#92400e", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontFamily: "system-ui", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            📶 Offline Mode
          </span>
        )}
        <span style={{ fontSize: 13, color: "#6b7280", fontFamily: "system-ui" }}>🏆 <strong style={{ color: "#f59e0b" }}>{progress.totalScore}</strong></span>
        {onProgress && <button onClick={onProgress} style={{ background: "none", border: "1px solid #e5e7eb", padding: "6px 14px", borderRadius: 7, fontFamily: "Georgia", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#1a1a2e" }}>Progress</button>}
        {onLevels && !showBack && <button onClick={onLevels} style={{ background: "#1a1a2e", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 7, fontFamily: "Georgia", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Levels</button>}
      </div>
    </nav>
  );
}

// ============================================================
// QUESTION BROWSER (dropdown to see/jump to all questions)
// ============================================================
function QuestionBrowser({ exercises, currentIndex, onSelect, progress }) {
  const [open, setOpen] = useState(false);
  const levelColors = { b: "#10b981", i: "#3b82f6", a: "#ef4444" };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 14px", fontFamily: "system-ui", fontWeight: 600, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#1a1a2e", whiteSpace: "nowrap" }}>
        ☰ All Questions {open ? "▲" : "▼"}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 150 }} />
          <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", border: "2px solid #1a1a2e", borderRadius: 14, boxShadow: "6px 6px 0 rgba(26,26,46,0.12)", width: 310, maxHeight: 460, overflow: "auto", zIndex: 200, padding: 10 }}>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, padding: "0 4px" }}>
              Click any question to jump to it
            </div>
            {exercises.map((ex, i) => {
              const isDone = progress.completedExercises.includes(ex.id);
              const isCurrent = i === currentIndex;
              const color = levelColors[ex.id[0]] || "#6b7280";
              return (
                <div key={ex.id} onClick={() => { onSelect(i); setOpen(false); }}
                  style={{ padding: "9px 10px", borderRadius: 8, marginBottom: 5, cursor: "pointer", background: isCurrent ? "#fef3c7" : isDone ? "#f0fdf4" : "#fafaf7", border: isCurrent ? "2px solid #f59e0b" : isDone ? "1px solid #d1fae5" : "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 9 }}
                  onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = "#f3f4f6"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = isCurrent ? "#fef3c7" : isDone ? "#f0fdf4" : "#fafaf7"; }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "system-ui", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ex.title}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: "#9ca3af", textTransform: "uppercase", marginTop: 1 }}>
                      {ex.type === "trueFalse" ? "T/F" : ex.type === "multiChoice" ? "MCQ" : "Order"}
                    </div>
                  </div>
                  <span style={{ fontSize: 13 }}>{isCurrent ? "👁" : isDone ? "✅" : "○"}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// LANDING
// ============================================================
function Landing() {
  const { setCurrentView } = useApp();
  return (
    <div style={{ minHeight: "100vh", background: "#fafaf7", fontFamily: "Georgia, serif", color: "#1a1a2e" }}>
      <NavBar onHome={() => setCurrentView("landing")} onLevels={() => setCurrentView("levels")} onProgress={() => setCurrentView("progress")} />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "64px 28px 40px" }}>
        <div style={{ display: "inline-block", background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 999, padding: "5px 14px", fontSize: 12, fontFamily: "monospace", marginBottom: 24, color: "#92400e" }}>🧠 Learn Logic Through Real Code</div>
        <h1 style={{ fontSize: "clamp(32px, 5.5vw, 64px)", fontWeight: 900, lineHeight: 1.07, letterSpacing: "-2px", marginBottom: 22 }}>
          Read code.<br /><span style={{ color: "#f59e0b" }}>Think before you run.</span>
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: "#4b5563", maxWidth: 560, marginBottom: 40, fontFamily: "system-ui" }}>
          ThinkFirst builds programming intuition using real Python code snippets. Predict outputs, trace logic, spot bugs — no syntax memorization required.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => setCurrentView("levels")} style={{ background: "#f59e0b", color: "#1a1a2e", border: "none", padding: "14px 32px", borderRadius: 10, fontFamily: "Georgia", fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "4px 4px 0 #1a1a2e" }}>Start Learning →</button>
          <button onClick={() => setCurrentView("progress")} style={{ background: "transparent", color: "#1a1a2e", border: "2px solid #1a1a2e", padding: "14px 32px", borderRadius: 10, fontFamily: "Georgia", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>View Progress</button>
        </div>
      </div>

      {/* Sample code preview */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 28px 56px" }}>
        <CodeBlock code={`score = 85\nif score >= 90:\n    print("Grade: A")\nelif score >= 80:\n    print("Grade: B")   # What prints?\nelse:\n    print("Grade: C")`} />
      </div>

      <div style={{ background: "#1a1a2e", color: "#fafaf7", padding: "48px 28px", textAlign: "center" }}>
        <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 12, letterSpacing: "-1px" }}>Three Levels. 60 Questions. Pure Logic.</h2>
        <p style={{ color: "#9ca3af", marginBottom: 32, fontFamily: "system-ui", fontSize: 14 }}>20 code-based questions per level. Build real code-reading ability.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
          {[["🌱","Beginner","Variables, if/else, booleans, lists"],["⚡","Intermediate","Loops, functions, dicts, slicing"],["🔥","Advanced","Recursion, closures, decorators, generators"]].map(([icon,label,desc])=>(
            <div key={label} style={{ background: "#262640", border: "1px solid #374151", borderRadius: 12, padding: "18px 24px", minWidth: 180, textAlign: "left" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{label}</div>
              <div style={{ color: "#9ca3af", fontSize: 12, fontFamily: "system-ui", lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LEVELS
// ============================================================
function Levels() {
  const { setCurrentView, setSelectedLevel, progress } = useApp();
  const levelData = [
    { key: "beginner", label: "Beginner", icon: "🌱", color: "#10b981", desc: "Variables, if/else, boolean logic, list basics. Perfect for newcomers.", pts: 10 },
    { key: "intermediate", label: "Intermediate", icon: "⚡", color: "#3b82f6", desc: "Loops, functions, dictionaries, string slicing, comprehensions.", pts: 20 },
    { key: "advanced", label: "Advanced", icon: "🔥", color: "#ef4444", desc: "Recursion, closures, decorators, generators, mutability traps.", pts: 30 },
  ];
  return (
    <div style={{ minHeight: "100vh", background: "#fafaf7", fontFamily: "Georgia, serif", color: "#1a1a2e" }}>
      <NavBar onHome={() => setCurrentView("landing")} onProgress={() => setCurrentView("progress")} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 28px" }}>
        <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-2px", marginBottom: 8 }}>Choose Your Level</h1>
        <p style={{ color: "#6b7280", marginBottom: 40, fontFamily: "system-ui", fontSize: 14 }}>All 60 questions feature real Python snippets to analyze and reason through.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {levelData.map(l => {
            const exs = EXERCISES[l.key];
            const completed = exs.filter(e => progress.completedExercises.includes(e.id)).length;
            const score = exs.reduce((s, e) => s + (progress.scores[e.id] || 0), 0);
            return (
              <div key={l.key} onClick={() => { setSelectedLevel(l.key); setCurrentView("exercise"); }}
                style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 14, padding: 24, cursor: "pointer", transition: "border 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.border = `2px solid ${l.color}`; e.currentTarget.style.boxShadow = `4px 4px 0 ${l.color}35`; }}
                onMouseLeave={e => { e.currentTarget.style.border = "2px solid #e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ fontSize: 40, flexShrink: 0 }}>{l.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 19 }}>{l.label}</span>
                      <span style={{ background: "#f3f4f6", borderRadius: 999, padding: "2px 9px", fontSize: 11, fontFamily: "monospace", color: "#6b7280" }}>20 questions · {l.pts}pts each</span>
                      {completed === exs.length && <span style={{ background: "#d1fae5", color: "#065f46", borderRadius: 999, padding: "2px 9px", fontSize: 11, fontFamily: "system-ui" }}>✓ Done</span>}
                    </div>
                    <p style={{ color: "#6b7280", fontFamily: "system-ui", fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>{l.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1 }}><ProgressBar value={completed} max={exs.length} color={l.color} /></div>
                      <span style={{ fontSize: 12, fontFamily: "system-ui", color: "#9ca3af", whiteSpace: "nowrap" }}>{completed}/{exs.length} · {score}pts</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 20, color: "#d1d5db" }}>→</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EXERCISE QUESTION COMPONENTS (with keyboard nav + timer)
// ============================================================
function TimerBadge({ elapsed, format, stopped, solveTime }) {
  if (stopped) {
    return (
      <span style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontFamily: "monospace", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
        ⏱ Solved in {format(solveTime)}
      </span>
    );
  }
  const urgent = elapsed > 60;
  return (
    <span style={{ background: urgent ? "#fef3c7" : "#f8fafc", border: `1px solid ${urgent ? "#f59e0b" : "#e2e8f0"}`, color: urgent ? "#92400e" : "#64748b", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontFamily: "monospace", fontWeight: 600 }}>
      ⏱ {format(elapsed)}
    </span>
  );
}

function TrueFalseExercise({ exercise, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0); // 0=True, 1=False
  const { elapsed, stop, format } = useTimer();
  const [solveTime, setSolveTime] = useState(null);
  const vals = [true, false];

  const submit = (val) => {
    if (submitted) return;
    const t = stop();
    setSolveTime(t);
    setSelected(val); setSubmitted(true); onComplete(val === exercise.correct, t);
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (submitted) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setFocusIdx(0); }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setFocusIdx(1); }
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); submit(vals[focusIdx]); }
      if (e.key === "t" || e.key === "T" || e.key === "1") submit(true);
      if (e.key === "f" || e.key === "F" || e.key === "2") submit(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [submitted, focusIdx]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        {exercise.code && <span />}
        <TimerBadge elapsed={elapsed} format={format} stopped={submitted} solveTime={solveTime} />
      </div>
      {exercise.code && <CodeBlock code={exercise.code} />}
      <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, fontFamily: "system-ui", lineHeight: 1.5 }}>{exercise.question}</p>
      {!submitted && (
        <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace", marginBottom: 14, display: "flex", gap: 12 }}>
          <span>← → to focus</span><span>Enter/Space to select</span><span>T = True · F = False</span>
        </div>
      )}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {vals.map((val, idx) => {
          let bg = "#fff", border = "2px solid #e5e7eb";
          if (!submitted && focusIdx === idx) { border = "2px solid #6366f1"; bg = "#f5f3ff"; }
          if (submitted && selected === val) { bg = val === exercise.correct ? "#d1fae5" : "#fee2e2"; border = `2px solid ${val === exercise.correct ? "#10b981" : "#ef4444"}`; }
          if (submitted && val === exercise.correct && selected !== val) { border = "2px solid #10b981"; bg = "#f0fdf4"; }
          return (
            <button key={String(val)} onClick={() => submit(val)} onFocus={() => setFocusIdx(idx)}
              style={{ background: bg, border, borderRadius: 10, padding: "16px 40px", fontFamily: "Georgia", fontWeight: 700, fontSize: 16, cursor: submitted ? "default" : "pointer", transition: "all 0.15s", outline: "none" }}>
              {val ? "✅ True" : "❌ False"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MultiChoiceExercise({ exercise, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);
  const { elapsed, stop, format } = useTimer();
  const [solveTime, setSolveTime] = useState(null);

  const submit = (i) => {
    if (submitted) return;
    const t = stop();
    setSolveTime(t);
    setSelected(i); setSubmitted(true); onComplete(i === exercise.correct, t);
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (submitted) return;
      const count = exercise.options.length;
      if (e.key === "ArrowUp") { e.preventDefault(); setFocusIdx(i => (i - 1 + count) % count); }
      if (e.key === "ArrowDown") { e.preventDefault(); setFocusIdx(i => (i + 1) % count); }
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); submit(focusIdx); }
      if (e.key === "1" || e.key === "a" || e.key === "A") submit(0);
      if (e.key === "2" || e.key === "b" || e.key === "B") submit(1);
      if (e.key === "3" || e.key === "c" || e.key === "C") submit(2);
      if (e.key === "4" || e.key === "d" || e.key === "D") submit(3);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [submitted, focusIdx, exercise.options.length]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span />
        <TimerBadge elapsed={elapsed} format={format} stopped={submitted} solveTime={solveTime} />
      </div>
      {exercise.code && <CodeBlock code={exercise.code} />}
      <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 14, fontFamily: "system-ui", lineHeight: 1.5 }}>{exercise.question}</p>
      {!submitted && (
        <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace", marginBottom: 12, display: "flex", gap: 12 }}>
          <span>↑ ↓ to navigate</span><span>Enter to confirm</span><span>A B C D to jump</span>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {exercise.options.map((opt, i) => {
          let bg = "#fff", border = "2px solid #e5e7eb";
          if (!submitted && focusIdx === i) { border = "2px solid #6366f1"; bg = "#f5f3ff"; }
          if (submitted) {
            if (i === exercise.correct) { bg = "#d1fae5"; border = "2px solid #10b981"; }
            if (i === selected && i !== exercise.correct) { bg = "#fee2e2"; border = "2px solid #ef4444"; }
          }
          return (
            <button key={i} onClick={() => submit(i)} onFocus={() => setFocusIdx(i)}
              style={{ background: bg, border, borderRadius: 9, padding: "12px 16px", fontFamily: "system-ui", fontSize: 14, cursor: submitted ? "default" : "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, transition: "all 0.15s", outline: "none" }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: !submitted && focusIdx === i ? "#6366f1" : "#f3f4f6", color: !submitted && focusIdx === i ? "#fff" : "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, flexShrink: 0, transition: "all 0.15s" }}>
                {["A","B","C","D"][i]}
              </span>
              <code style={{ fontFamily: "'Fira Code',Consolas,monospace", fontSize: 13 }}>{opt}</code>
              {submitted && i === exercise.correct && <span style={{ marginLeft: "auto", color: "#10b981", fontSize: 14 }}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// EXERCISE ENGINE
// ============================================================
function ExerciseEngine() {
  const { selectedLevel, setCurrentView, progress, completeExercise } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const [lastSolveTime, setLastSolveTime] = useState(null);
  const [key, setKey] = useState(0);

  const exercises = EXERCISES[selectedLevel] || [];
  const levelColor = { beginner: "#10b981", intermediate: "#3b82f6", advanced: "#ef4444" }[selectedLevel];
  const pts = { beginner: 10, intermediate: 20, advanced: 30 }[selectedLevel] || 10;
  const completedCount = exercises.filter(e => progress.completedExercises.includes(e.id)).length;

  const jumpTo = (i) => {
    setCurrentIndex(i);
    setWasCorrect(false);
    setShowExplanation(false);
    setShowFlowchart(false);
    setLastSolveTime(null);
    setKey(k => k + 1);
  };

  const handleComplete = (correct, solveTime) => {
    setWasCorrect(correct);
    setShowExplanation(true);
    setLastSolveTime(solveTime);
    completeExercise(exercises[currentIndex].id, correct, pts, solveTime);
  };

  const nextExercise = () => {
    if (currentIndex + 1 < exercises.length) jumpTo(currentIndex + 1);
    else setCurrentIndex(exercises.length);
  };

  // Level complete screen
  if (currentIndex >= exercises.length) {
    const totalEarned = exercises.reduce((s, e) => s + (progress.scores[e.id] || 0), 0);
    const times = exercises.map(e => progress.times?.[e.id]).filter(Boolean);
    const avgTime = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
    const formatT = (s) => s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;
    return (
      <div style={{ minHeight: "100vh", background: "#fafaf7", fontFamily: "Georgia, serif" }}>
        <NavBar showBack backLabel="← Levels" onHome={() => setCurrentView("levels")} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", gap: 18, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 68 }}>🎉</div>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1px" }}>Level Complete!</h2>
          <p style={{ color: "#6b7280", fontFamily: "system-ui", fontSize: 15 }}>You finished all <strong style={{ textTransform: "capitalize" }}>{selectedLevel}</strong> questions.</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 12, padding: "18px 36px", textAlign: "center" }}>
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Score</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: levelColor }}>{totalEarned} pts</div>
            </div>
            {avgTime != null && (
              <div style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 12, padding: "18px 36px", textAlign: "center" }}>
                <div style={{ fontSize: 11, fontFamily: "monospace", color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Avg Time</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#6366f1" }}>⏱ {formatT(avgTime)}</div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => jumpTo(0)} style={{ background: "#fff", color: "#1a1a2e", border: "2px solid #1a1a2e", padding: "12px 24px", borderRadius: 10, fontFamily: "Georgia", fontWeight: 700, cursor: "pointer" }}>↺ Retry</button>
            <button onClick={() => setCurrentView("levels")} style={{ background: "#1a1a2e", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontFamily: "Georgia", fontWeight: 700, cursor: "pointer" }}>All Levels</button>
            <button onClick={() => setCurrentView("progress")} style={{ background: "#f59e0b", color: "#1a1a2e", border: "none", padding: "12px 24px", borderRadius: 10, fontFamily: "Georgia", fontWeight: 700, cursor: "pointer" }}>Progress →</button>
          </div>
        </div>
      </div>
    );
  }

  const exercise = exercises[currentIndex];
  const formatT = (s) => s != null ? (s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf7", fontFamily: "Georgia, serif", color: "#1a1a2e" }}>
      <NavBar showBack backLabel="← Levels" onHome={() => setCurrentView("levels")} onProgress={() => setCurrentView("progress")} />

      {/* Sub-bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f3f4f6", padding: "9px 28px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#9ca3af", textTransform: "capitalize", whiteSpace: "nowrap" }}>
            {selectedLevel} · {currentIndex + 1}/{exercises.length}
          </span>
          <div style={{ flex: 1 }}><ProgressBar value={completedCount} max={exercises.length} color={levelColor} /></div>
          <span style={{ fontSize: 11, fontFamily: "system-ui", color: "#9ca3af", whiteSpace: "nowrap" }}>{completedCount} done</span>
          <QuestionBrowser exercises={exercises} currentIndex={currentIndex} onSelect={jumpTo} progress={progress} />
        </div>
      </div>

      {/* Layout */}
      <div style={{ maxWidth: 900, margin: "28px auto", padding: "0 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>

        {/* Dot navigation */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7, paddingTop: 4, flexShrink: 0 }}>
          {exercises.map((ex, i) => {
            const isDone = progress.completedExercises.includes(ex.id);
            const isCurrent = i === currentIndex;
            const exTime = progress.times?.[ex.id];
            return (
              <button key={ex.id} onClick={() => jumpTo(i)} title={`${ex.title}${exTime ? ` · ⏱ ${formatT(exTime)}` : ""}`}
                style={{ width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer", background: isCurrent ? levelColor : isDone ? `${levelColor}25` : "#e5e7eb", color: isCurrent ? "#fff" : isDone ? levelColor : "#9ca3af", fontWeight: 700, fontSize: 11, fontFamily: "monospace", outline: isCurrent ? `2px solid ${levelColor}` : "none", outlineOffset: 2, transition: "all 0.15s" }}>
                {isDone && !isCurrent ? "✓" : i + 1}
              </button>
            );
          })}
        </div>

        {/* Exercise card */}
        <div style={{ flex: 1 }}>
          <div style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 16, padding: "28px 30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ background: "#f3f4f6", borderRadius: 999, padding: "3px 10px", fontSize: 10, fontFamily: "monospace", color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {exercise.type === "trueFalse" ? "True / False" : "Multiple Choice"}
              </span>
              <span style={{ background: `${levelColor}18`, color: levelColor, borderRadius: 999, padding: "3px 10px", fontSize: 10, fontFamily: "monospace", textTransform: "capitalize" }}>{selectedLevel} · +{pts}pts</span>
              {progress.completedExercises.includes(exercise.id) && progress.times?.[exercise.id] && (
                <span style={{ background: "#ede9fe", color: "#5b21b6", borderRadius: 999, padding: "3px 10px", fontSize: 10, fontFamily: "system-ui" }}>
                  ⏱ Last: {formatT(progress.times[exercise.id])}
                </span>
              )}
              {progress.completedExercises.includes(exercise.id) && (
                <span style={{ background: "#d1fae5", color: "#065f46", borderRadius: 999, padding: "3px 10px", fontSize: 10, fontFamily: "system-ui" }}>✓ Previously done</span>
              )}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 22, letterSpacing: "-0.5px" }}>{exercise.title}</h2>

            {exercise.type === "multiChoice" && <MultiChoiceExercise key={`mc-${exercise.id}-${key}`} exercise={exercise} onComplete={handleComplete} />}
            {exercise.type === "trueFalse" && <TrueFalseExercise key={`tf-${exercise.id}-${key}`} exercise={exercise} onComplete={handleComplete} />}

            {/* Feedback + Flowchart */}
            {showExplanation && (
              <div style={{ marginTop: 20 }}>
                {/* Result banner */}
                <div style={{ background: wasCorrect ? "#d1fae5" : "#fef3c7", border: `2px solid ${wasCorrect ? "#10b981" : "#f59e0b"}`, borderRadius: 12, padding: 18, marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "Georgia" }}>
                      {wasCorrect ? `🎉 Correct! +${pts} pts` : "🤔 Not quite — here's why:"}
                    </div>
                    {lastSolveTime != null && (
                      <span style={{ background: wasCorrect ? "#bbf7d0" : "#fde68a", color: wasCorrect ? "#065f46" : "#78350f", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontFamily: "monospace", fontWeight: 600 }}>
                        ⏱ Solved in {formatT(lastSolveTime)}
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "system-ui", fontSize: 14, color: "#374151", lineHeight: 1.75, margin: 0 }}>{exercise.explanation}</p>
                </div>

                {/* Flowchart toggle */}
                <button onClick={() => setShowFlowchart(f => !f)}
                  style={{ background: showFlowchart ? "#0f172a" : "#f8fafc", color: showFlowchart ? "#94a3b8" : "#475569", border: `1px solid ${showFlowchart ? "#1e293b" : "#e2e8f0"}`, padding: "8px 16px", borderRadius: 8, fontFamily: "system-ui", fontWeight: 600, fontSize: 12, cursor: "pointer", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <span>⬡</span> {showFlowchart ? "Hide" : "Show"} Logic Path
                </button>

                {showFlowchart && <LogicFlowchart exercise={exercise} />}

                <div style={{ marginTop: 14 }}>
                  <button onClick={nextExercise}
                    style={{ background: levelColor, color: "#fff", border: "none", padding: "12px 26px", borderRadius: 9, fontFamily: "Georgia", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    {currentIndex + 1 < exercises.length ? "Next Question →" : "Finish Level 🏁"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PROGRESS PAGE
// ============================================================
function ProgressPage() {
  const { progress, setCurrentView, resetProgress, isOffline } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  const allExercises = [...EXERCISES.beginner, ...EXERCISES.intermediate, ...EXERCISES.advanced];
  const completed = progress.completedExercises.length;
  const allTimes = Object.values(progress.times || {});
  const avgTime = allTimes.length ? Math.round(allTimes.reduce((a, b) => a + b, 0) / allTimes.length) : null;
  const formatT = (s) => s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf7", fontFamily: "Georgia, serif", color: "#1a1a2e" }}>
      <NavBar onHome={() => setCurrentView("landing")} onLevels={() => setCurrentView("levels")} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-2px", margin: 0 }}>Your Progress</h1>
          {isOffline && <span style={{ background: "#fef3c7", border: "1px solid #f59e0b", color: "#92400e", borderRadius: 999, padding: "4px 12px", fontSize: 12, fontFamily: "system-ui", fontWeight: 600 }}>📶 Offline</span>}
        </div>
        <p style={{ color: "#6b7280", fontFamily: "system-ui", marginBottom: 36, fontSize: 14 }}>Track your code-reading journey across all 60 questions.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Completed", value: `${completed}/${allExercises.length}`, color: "#f59e0b" },
            { label: "Score", value: `${progress.totalScore} pts`, color: "#3b82f6" },
            { label: "Progress", value: `${allExercises.length === 0 ? 0 : Math.round((completed / allExercises.length) * 100)}%`, color: "#10b981" },
            ...(avgTime != null ? [{ label: "Avg Time", value: `⏱ ${formatT(avgTime)}`, color: "#6366f1" }] : []),
          ].map(c => (
            <div key={c.label} style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 12, padding: "18px 16px" }}>
              <div style={{ fontSize: 10, fontFamily: "monospace", color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 7 }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>

        {["beginner", "intermediate", "advanced"].map(level => {
          const exs = EXERCISES[level];
          const color = { beginner: "#10b981", intermediate: "#3b82f6", advanced: "#ef4444" }[level];
          const done = exs.filter(e => progress.completedExercises.includes(e.id)).length;
          const earned = exs.reduce((s, e) => s + (progress.scores[e.id] || 0), 0);
          const maxPts = { beginner: 10, intermediate: 20, advanced: 30 }[level];
          const levelTimes = exs.map(e => progress.times?.[e.id]).filter(Boolean);
          const levelAvg = levelTimes.length ? Math.round(levelTimes.reduce((a, b) => a + b, 0) / levelTimes.length) : null;
          return (
            <div key={level} style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 12, padding: 22, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 16, textTransform: "capitalize" }}>{{ beginner:"🌱",intermediate:"⚡",advanced:"🔥" }[level]} {level}</span>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {levelAvg != null && <span style={{ fontSize: 11, fontFamily: "monospace", color: "#6366f1" }}>⏱ avg {formatT(levelAvg)}</span>}
                  <span style={{ fontFamily: "system-ui", fontSize: 12, color: "#6b7280" }}>{done}/{exs.length} · {earned}/{exs.length * maxPts} pts</span>
                </div>
              </div>
              <ProgressBar value={done} max={exs.length} color={color} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6, marginTop: 12 }}>
                {exs.map((e, i) => {
                  const isDone = progress.completedExercises.includes(e.id);
                  const t = progress.times?.[e.id];
                  return (
                    <div key={e.id} title={`${e.title}${t ? ` · ⏱ ${formatT(t)}` : ""}`}
                      style={{ background: isDone ? color : "#f3f4f6", borderRadius: 7, padding: "8px 4px", textAlign: "center" }}>
                      <div style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: isDone ? "#fff" : "#9ca3af" }}>Q{i + 1}</div>
                      <div style={{ fontFamily: "system-ui", fontSize: 9, color: isDone ? "#ffffff99" : "#d1d5db", marginTop: 2 }}>
                        {isDone ? (t ? formatT(t) : "✓") : "–"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Offline info card */}
        <div style={{ marginTop: 20, marginBottom: 20, padding: 20, background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: "#0369a1", fontFamily: "system-ui", fontSize: 14 }}>📶 Offline Mode</div>
          <p style={{ fontFamily: "system-ui", fontSize: 13, color: "#075985", marginBottom: 0, lineHeight: 1.6 }}>
            ThinkFirst works fully offline. All your progress is saved locally in this browser.
            {isOffline ? " You are currently offline — everything still works!" : " You are currently online."}
          </p>
        </div>

        <div style={{ padding: 20, background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: "#991b1b", fontFamily: "system-ui", fontSize: 14 }}>⚠️ Reset Progress</div>
          <p style={{ fontFamily: "system-ui", fontSize: 13, color: "#6b7280", marginBottom: 12 }}>Clears all scores, times, and completed exercises. Cannot be undone.</p>
          {!confirmReset
            ? <button onClick={() => setConfirmReset(true)} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 7, fontFamily: "Georgia", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Reset Everything</button>
            : <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { resetProgress(); setConfirmReset(false); }} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 7, fontFamily: "Georgia", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Yes, Reset</button>
                <button onClick={() => setConfirmReset(false)} style={{ background: "#fff", color: "#1a1a2e", border: "2px solid #e5e7eb", padding: "8px 20px", borderRadius: 7, fontFamily: "Georgia", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Cancel</button>
              </div>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ROOT
// ============================================================
function AppRouter() {
  const { currentView } = useApp();
  switch (currentView) {
    case "landing": return <Landing />;
    case "levels": return <Levels />;
    case "exercise": return <ExerciseEngine />;
    case "progress": return <ProgressPage />;
    default: return <Landing />;
  }
}

export default function App() {
  return <AppProvider><AppRouter /></AppProvider>;
}
