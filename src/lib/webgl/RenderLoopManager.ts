/**
 * RenderLoopManager - Centralized animation frame management
 * Handles all WebGL animations in a single optimized loop
 */

type RenderCallback = (deltaTime: number, elapsedTime: number) => void;

interface RenderSubscription {
  id: string;
  callback: RenderCallback;
  priority: number;
}

class RenderLoopManager {
  private static instance: RenderLoopManager;
  private subscriptions: Map<string, RenderSubscription> = new Map();
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private elapsedTime: number = 0;
  private targetFPS: number = 60;
  private frameInterval: number = 1000 / 60;

  private constructor() {}

  static getInstance(): RenderLoopManager {
    if (!RenderLoopManager.instance) {
      RenderLoopManager.instance = new RenderLoopManager();
    }
    return RenderLoopManager.instance;
  }

  /**
   * Subscribe to the render loop
   */
  subscribe(id: string, callback: RenderCallback, priority: number = 0): void {
    this.subscriptions.set(id, { id, callback, priority });
    
    if (!this.isRunning && this.subscriptions.size > 0) {
      this.start();
    }
  }

  /**
   * Unsubscribe from the render loop
   */
  unsubscribe(id: string): void {
    this.subscriptions.delete(id);
    
    if (this.subscriptions.size === 0) {
      this.stop();
    }
  }

  /**
   * Set target FPS (for performance optimization)
   */
  setTargetFPS(fps: number): void {
    this.targetFPS = fps;
    this.frameInterval = 1000 / fps;
  }

  /**
   * Start the render loop
   */
  private start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop();
  }

  /**
   * Stop the render loop
   */
  private stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main render loop
   */
  private loop = (): void => {
    if (!this.isRunning) return;

    this.animationFrameId = requestAnimationFrame(this.loop);

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    // Frame rate limiting
    if (deltaTime < this.frameInterval) return;

    this.lastTime = currentTime - (deltaTime % this.frameInterval);
    this.elapsedTime += deltaTime / 1000;

    // Sort by priority and execute callbacks
    const sortedSubscriptions = Array.from(this.subscriptions.values())
      .sort((a, b) => b.priority - a.priority);

    for (const subscription of sortedSubscriptions) {
      try {
        subscription.callback(deltaTime / 1000, this.elapsedTime);
      } catch (error) {
        console.error(`Render callback error [${subscription.id}]:`, error);
      }
    }
  };

  /**
   * Get current stats
   */
  getStats(): { subscribers: number; isRunning: boolean; elapsedTime: number } {
    return {
      subscribers: this.subscriptions.size,
      isRunning: this.isRunning,
      elapsedTime: this.elapsedTime,
    };
  }
}

export const renderLoop = RenderLoopManager.getInstance();
export default RenderLoopManager;
