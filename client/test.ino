
SYSTEM_MODE(MANUAL);
int led1 = D0;
int led2 = D7;

void setup() {

  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  WiFi.on();
}

void loop() {
  WiFi.connect();
  if(WiFi.ready()) {
    digitalWrite(led1, HIGH);
    digitalWrite(led2, HIGH);

    delay(300);

    digitalWrite(led1, LOW);
    digitalWrite(led2, LOW);

    delay(300);
    }
  }
