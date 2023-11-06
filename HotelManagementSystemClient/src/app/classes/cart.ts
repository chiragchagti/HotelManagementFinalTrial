import { AvailabilityResult } from "./availability-result";
import { CheckAvailability } from "./check-availability";

export class Cart {
    checkAvailability:CheckAvailability = new CheckAvailability
    availabilityResult:AvailabilityResult = new AvailabilityResult
}
