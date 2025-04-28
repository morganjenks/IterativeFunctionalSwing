import numpy as np
from .helpers import calculate_sample_range, min_max_of_array, remap

def adaptive_monotonicity_method(buffer_object, start_phase=0, end_phase=1, params=None):
    samples = []
    slopes = []


    # Compute total sample count and start/end indices
    total_sample_count, start_samp, end_samp, mutation_magnitude = calculate_sample_range(buffer_object, start_phase, end_phase)
    
    # Calculate slopes between adjacent points
    for i in range(start_samp, end_samp - 1):
        y1 = buffer_object[i]
        y2 = buffer_object[i + 1]
        slope = y2 - y1
        slopes.append(slope)
        samples.append(y1)
    
    samples.append(buffer_object[end_samp - 1])
    
    # Find minimum slope (most negative)
    min_slope = min(slopes)
    
    # Transform slopes to ensure minimum becomes zero
    transformed = []
    current_y = samples[0]
    transformed.append(current_y)
    
    for slope in slopes:
        # Adjust slope relative to minimum
        adjusted_slope = slope - min_slope
        current_y += adjusted_slope
        transformed.append(current_y)
    
    # Normalize to [0,1] range
    min_y = min(transformed)
    max_y = max(transformed)
    
    for i, y in enumerate(transformed):
        normalized_y = remap(y, min_y, max_y, 0, 1)
        buffer_object[start_samp + i] = normalized_y
    
    return buffer_object
