package com.quickhomehelp.entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "services")
@Data
@Getter
@Setter
public class HomeService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;       

    private String category;   


    private Integer baseDuration;   

    private Double basePrice;  
    


}
