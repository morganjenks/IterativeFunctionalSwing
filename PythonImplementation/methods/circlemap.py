import numpy as np
from methods.helpers import default_value, calculate_sample_range, blend

def standard_circle_map_method(buffer_object, start_phase=0, end_phase=1, params=None):
    if params is None:
        params = []

    # Set up defaults if args are undefined
    k = default_value(params[0] if len(params) > 0 else None, 1)
    omega = default_value(params[1] if len(params) > 1 else None, 0.1)
    start_value = default_value(params[2] if len(params) > 2 else None, 0)
    alpha = default_value(params[3] if len(params) > 3 else None, 0.5)

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
