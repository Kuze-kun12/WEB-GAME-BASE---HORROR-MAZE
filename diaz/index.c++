#include <iostream>
using namespace std;

string correctPassword = "diaz";

// LOGIN
bool login() {
    string password;

    cout << "=============================\n";
    cout << "   JEEPNEY BOARDING SYSTEM\n";
    cout << "=============================\n";
    cout << "Enter Password: ";
    cin >> password;

    if (password == correctPassword) {
        cout << "Access Granted!\n";
        return true;
    }

    cout << "Wrong Password!\n";
    return false;
}

// PRIORITY QUEUE
string pwdNames[100], pwdDest[100];
int pwdFront = 0, pwdRear = -1;

// REGULAR QUEUE
string queueNames[100], queueDest[100];
int front = 0, rear = -1;

// SEATS
const int MAX_SEATS = 5;
string seats[MAX_SEATS];

// STACK
string undoStack[100];
int top = -1;

// LINKED LIST
struct Node {
    string stop;
    Node* next;
};

Node* head = NULL;

// STACK FUNCTIONS
void pushUndo(string name) {
    undoStack[++top] = name;
}

void undoBoarding() {
    if (top == -1) {
        cout << "Nothing to undo.\n";
        return;
    }

    string lastPassenger = undoStack[top--];

    for (int i = 0; i < MAX_SEATS; i++) {
        if (seats[i] == lastPassenger) {
            seats[i] = "";
            break;
        }
    }

    cout << "Undo: " << lastPassenger << endl;
}

// LINKED LIST FUNCTIONS
void addStop(string stopName) {
    Node* newNode = new Node{stopName, NULL};

    if (!head) head = newNode;
    else {
        Node* temp = head;
        while (temp->next) temp = temp->next;
        temp->next = newNode;
    }
}

void displayStops() {
    cout << "\n=== ROUTE STOPS ===\n";

    for (Node* temp = head; temp; temp = temp->next)
        cout << "- " << temp->stop << endl;
}

// ADD PASSENGER
void addPassenger() {
    string name, destination;
    int type;

    cin.ignore();

    cout << "Enter Passenger Name: ";
    getline(cin, name);

    cout << "Enter Destination: ";
    getline(cin, destination);

    cout << "[1] Regular\n[2] PWD/Senior/Pregnant\nChoice: ";
    cin >> type;

    if (type == 2) {
        pwdNames[++pwdRear] = name;
        pwdDest[pwdRear] = destination;
        cout << "Added to PRIORITY lane.\n";
    } else {
        queueNames[++rear] = name;
        queueDest[rear] = destination;
        cout << "Added to regular queue.\n";
    }
}

// DISPLAY QUEUE
void displayQueue() {
    cout << "\n=== PRIORITY LANE ===\n";

    if (pwdRear < pwdFront)
        cout << "No priority passengers.\n";
    else
        for (int i = pwdFront; i <= pwdRear; i++)
            cout << i - pwdFront + 1 << ". "
                 << pwdNames[i] << " - "
                 << pwdDest[i] << endl;

    cout << "\n=== REGULAR QUEUE ===\n";

    if (rear < front)
        cout << "Queue is empty.\n";
    else
        for (int i = front; i <= rear; i++)
            cout << i - front + 1 << ". "
                 << queueNames[i] << " - "
                 << queueDest[i] << endl;
}

// BOARD PASSENGER
void boardPassenger() {
    string passengerName, passengerDest;

    if (pwdRear >= pwdFront) {
        passengerName = pwdNames[pwdFront];
        passengerDest = pwdDest[pwdFront++];
    }
    else if (rear >= front) {
        passengerName = queueNames[front];
        passengerDest = queueDest[front++];
    }
    else {
        cout << "No passengers in queue.\n";
        return;
    }

    for (int i = 0; i < MAX_SEATS; i++) {
        if (seats[i] == "") {
            seats[i] = passengerName;

            cout << "\nPassenger Boarded!\n";
            cout << "Name: " << passengerName << endl;
            cout << "Destination: " << passengerDest << endl;
            cout << "Seat Number: " << i + 1 << endl;

            pushUndo(passengerName);
            return;
        }
    }

    cout << "Vehicle is full.\n";
}

// DISPLAY SEATS
void displaySeats() {
    cout << "\n=== SEAT STATUS ===\n";

    for (int i = 0; i < MAX_SEATS; i++) {
        cout << "Seat " << i + 1 << ": ";
        cout << (seats[i] == "" ? "Empty" : seats[i]) << endl;
    }
}

// MAIN
int main() {

    for (int i = 0; i < MAX_SEATS; i++)
        seats[i] = "";

    if (!login()) return 0;

    addStop("Bacong");
    addStop("Dumaguete");
    addStop("Dauin");
    addStop("Zamboanguita");

    int choice;

    do {
        cout << "\n=============================\n";
        cout << " JEEPNEY BOARDING SYSTEM\n";
        cout << "=============================\n";
        cout << "[1] Add Passenger\n";
        cout << "[2] Board Passenger\n";
        cout << "[3] View Queue\n";
        cout << "[4] View Seats\n";
        cout << "[5] View Route Stops\n";
        cout << "[6] Undo Last Boarding\n";
        cout << "[7] Exit\n";
        cout << "Enter Choice: ";
        cin >> choice;

        switch (choice) {
            case 1: addPassenger(); break;
            case 2: boardPassenger(); break;
            case 3: displayQueue(); break;
            case 4: displaySeats(); break;
            case 5: displayStops(); break;
            case 6: undoBoarding(); break;
            case 7: cout << "Program Ended.\n"; break;
            default: cout << "Invalid Choice.\n";
        }

    } while (choice != 7);

    return 0;
}