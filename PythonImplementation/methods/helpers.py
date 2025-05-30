import math
import numpy as np


def default_values(something, default_val):
    if isinstance(default_val, (list, tuple)):
        something = something or []
        return tuple(something[i] if i < len(something) and something[i] is not None else default_val[i]
                     for i in range(len(default_val)))
    return something if something is not None else default_val

def calculate_sample_range(buffer_object, start_phase, end_phase, sample_rate=44100):
    total = len(buffer_object)
    start = int(start_phase * total)
    end = int(end_phase * total)
    magnitude = (end - start) / len(buffer_object)
    return [total, start, end, magnitude]

def blend(a, b, t):
    return t * b + (1 - t) * a

def create_array(length, default_value):
    if callable(default_value):
        return [default_value(i) for i in range(length)]
    return [default_value] * length

def remap(value, from_min, from_max, to_min, to_max):
    return to_min + (value - from_min) * (to_max - to_min) / (from_max - from_min)

def modulo(n, m):
    return ((n % m) + m) % m

def pulses_to_steps(array, hits):
    count = 0
    for i in range(len(array)):
        if array[i] == 1:
            array[i] = count
            count += 1 / hits
        else:
            array[i] = count
    return array

def min_max_of_array(arr):
    return {'min': min(arr), 'max': max(arr)}



