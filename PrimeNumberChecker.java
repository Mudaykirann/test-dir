import java.util.Scanner;

public class PrimeNumberChecker {

    /**
     * Checks if a given integer is a prime number.
     * 
     * A prime number is a natural number greater than 1 
     * that has no positive divisors other than 1 and itself.
     *
     * @param n The number to check.
     * @return true if the number is prime, false otherwise.
     */
    public static boolean isPrime(int n) {
        // Numbers less than 2 are not prime.
        if (n <= 1) {
            return false;
        }

        // Check for factors from 2 up to the square root of n.
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                // If n is divisible by any number other than 1 and itself, it's not prime.
                return false;
            }
        }

        // If the loop completes without finding any divisors, the number is prime.
        return true;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter a number to check: ");
        
        if (scanner.hasNextInt()) {
            int number = scanner.nextInt();
            if (isPrime(number)) {
                System.out.println(number + " is a prime number.");
            } else {
                System.out.println(number + " is not a prime number.");
            }
        } else {
            System.out.println("Invalid input. Please enter an integer.");
        }
        
        scanner.close();
    }
}
