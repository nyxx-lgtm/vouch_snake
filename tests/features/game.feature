Feature: Snake Game with deterministic hook
  As a player
  I want reliable controls and scoring
  So that gameplay, speed, and persistence work as designed

  Background:
    Given I open the Snake Game

  @smoke
  Scenario: Start shows score 0
    When I start the game
    Then the score is 0

  @pause
  Scenario: Pause and resume keeps the same score
    When I start the game
    And I pause the game
    And I resume the game
    Then the score is 0

  @score @hook
  Scenario: Eating one food increases score by 10
    When I start the game
    And I place food ahead of the snake
    And I tick the game 1 times
    Then the score is 10

  @score @speed @hook
  Scenario: Speed decreases after 50 points
    When I start the game
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    Then the score is 50
    And the game speed is less than 100

  @persist
  Scenario: High score persists after reload
    When I start the game
    And I place food ahead of the snake
    And I tick the game 1 times
    Then the score is 10
    # Reload to simulate a new session
    Given I open the Snake Game
    Then the high score is at least 10

  @gameover @hook
  Scenario: Forcing a wall hit shows Game Over
    When I start the game
    And I force a wall hit
    Then the game over screen is visible

  @controls
  Scenario: Direction can be set deterministically
    When I start the game
    And I set the direction to "ArrowUp"
    And I tick the game 1 times
    Then the score is 0

  @persist @score @hook
  Scenario: High score updates after a better run
    When I start the game
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    Then the score is 50
    # Reload and verify persisted high score >= 50
    Given I open the Snake Game
    Then the high score is at least 50

  @speed @hook
  Scenario: Speed threshold after 100 points
    When I start the game
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    Then the score is 100
    And the game speed is less than 90

  @ui @pause
  Scenario: Resume via button continues same run
    When I start the game
    And I pause the game
    And I resume the game
    And I tick the game 1 times
    Then the score is 0

  @score @hook
  Scenario: Two foods eaten reach 20 points
    When I start the game
    And I place food ahead of the snake
    And I tick the game 1 times
    And I place food ahead of the snake
    And I tick the game 1 times
    Then the score is 20

  @smoke @persist
  Scenario: High score survives multiple reloads
    When I start the game
    And I place food ahead of the snake
    And I tick the game 1 times
    Then the score is 10
    Given I open the Snake Game
    Then the high score is at least 10
    Given I open the Snake Game
    Then the high score is at least 10
