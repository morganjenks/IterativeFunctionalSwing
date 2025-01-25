import numpy as np

def brute_monotonicity_method(buffer_object):
    total_sample_count = len(buffer_object)
    prev_sample_value = 0

    for i in range(total_sample_count):
        current_sample_value = buffer_object[i]
        delta = current_sample_value - prev_sample_value
        increasing = delta >= 0
        rectified_delta = delta if increasing else 0
        updated_current_sample = prev_sample_value + rectified_delta
        buffer_object[i] = updated_current_sample
        prev_sample_value = updated_current_sample
