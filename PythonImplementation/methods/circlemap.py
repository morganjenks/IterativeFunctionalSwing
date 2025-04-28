import numpy as np
from methods.helpers import default_values, calculate_sample_range, blend

def standard_circle_map_method(buffer_object, start_phase=0, end_phase=1, params=None):
    if params is None:
        params = []

    # Set up defaults if args are undefined
    k, omega, start_value, alpha = default_values(params, [1,0.1,0,0.5])

    total_samps = len(buffer_object)
    start_samp = int(start_phase * total_samps)
    end_samp = int(end_phase * total_samps)

    # Initialize phase value
    y = start_value

    # Set the very first sample to the start phase
    buffer_object[start_samp % total_samps] = y

    # Begin the loop from start_samp + 1
    for i in range(start_samp + 1, end_samp):
        # Apply the modified dynamical formula, feeding back into y
        y = (y + omega - (k / (2 * np.pi)) * np.sin(2 * np.pi * y)) % 1

        # Write the result to the buffer (modulus with total_samps)
        buffer_object[i % total_samps] = blend(buffer_object[i], y, alpha)
